'use client'
import React, { Suspense, useCallback, useContext, useOptimistic, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import TransitionContext from './TransitionContext.js';
import BundlerContext from './BundlerContext.js';
import LinkUtility from './LinkUtility.js';
type Intercept = {resume?: () => void, commit?: () => void, signal?: AbortSignal, title?: string, controller?: NavigationPrecommitController, hasUAVisualTransition?: boolean, sceneViews?: any, scrollY?: number};
type RSCFetch = {sceneViewKeys: string[], resolve: (sceneViewKeys: string[]) => void, sceneViews: Promise<any>, timeout?: ReturnType<typeof setTimeout>};
type NavigationHandlerState = { ignoreCache?: boolean | string, rscCache?: any, rscFetching?: any, rscFetch?: RSCFetch, hasUAVisualTransition?: boolean, uncommitted?: boolean, trackable?: any, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator & { navigateLink: (...args: [...Parameters<StateNavigator['navigateLink']>, Intercept?]) => void } };

const NavigationHandler = ({stateNavigator, url, children}: {stateNavigator: StateNavigator, url?: string, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, intercept?: Intercept}>();
    const [_nextNavigationEvent, setNextNavigationEvent] = useOptimistic?.(navigationEvent) || [navigationEvent, () => {}];
    const [isPending, startTransition] = useTransition?.() || [false];
    const [, setTransitionAborted] = useState({});
    const hydrating = useSyncExternalStore(useCallback(() => () => {}, []), () => false, () => true);
    const [ssr] = useState(hydrating);
    const nextNavigationEvent = !_nextNavigationEvent?.intercept?.signal?.aborted ? _nextNavigationEvent : navigationEvent;
    const navigationTransition = useMemo(() => ({navigationEvent: navigationEvent?.data, nextNavigationEvent: nextNavigationEvent?.data}), [navigationEvent, nextNavigationEvent]);
    const rootViews = useRef({});
    const getShow = (active: string | string[], key: string) => (
        active != null && (typeof active === 'string' ? key === active : active.indexOf(key) !== -1)
    );
    const cache = useRef([]);
    const prefetches = useRef([]);
    const invalidateListeners = useRef(new Set<(stateContext: StateContext) => void>());
    const expireCache = (sceneViewKey: string | boolean, crumbs?: number) => {
        cache.current.forEach((crumbCache, i) => {
            if (crumbs !== undefined && i !== crumbs) return;
            for (const key in crumbCache.sceneViews) {
                if (sceneViewKey === true || crumbCache.sceneViews[key].ancestors.has(sceneViewKey)) delete crumbCache.sceneViews[key];
            }
        });
    };
    const markStale = (scope: string | true, {state, stateNavigator: {stateContext: {crumbs}}}: NavigationHandlerState) => {
        const stateKeys = [...crumbs.map(crumb => crumb.state.key), state.key];
        cache.current = stateKeys.map((stateKey, i) => (
            scope === true || stateKey === scope ? {stateKey, sceneViews: {}, stale: i < crumbs.length} : cache.current[i]
        ));
        invalidateListeners.current.forEach(listener => listener(stateNavigator.stateContext));
    };
    const filterPrefetches = (keep: (prefetch: any) => boolean) => {
        prefetches.current.forEach(crumbPrefetches => {
            crumbPrefetches.prefetches = crumbPrefetches.prefetches.filter(keep);
        });
    };
    const {fetchRSC: fetchServer, onHmrReload} = useContext(BundlerContext);
    const raiseNavigationEvent = useCallback((stateContext: StateContext = stateNavigator.stateContext, intercept: Intercept = {}, rscCache?: any) => {
        class AsyncStateNavigator extends StateNavigator {
            constructor() {
                super(stateNavigator, stateNavigator.historyManager);
                this.stateContext = stateContext;
                this.configure = stateNavigator.configure.bind(stateNavigator);
                this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
                this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
                this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            }
            navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
                suspendNavigation?: (stateContext: StateContext, resumeNavigation: () => void) => void,
                currentContext = this.stateContext, intercept: Intercept = {}) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                let navigating = false;
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        navigating = true;
                        const startTran = startTransition || ((transition) => transition());
                        intercept.title = typeof document !== 'undefined' && fetchServer ? document.title : null;
                        if (typeof window !== 'undefined' && fetchServer && window.navigation?.currentEntry) window.navigation.updateCurrentEntry({state: {...window.navigation.currentEntry.getState(), scrollY: window.scrollY}});
                        intercept.resume = resumeNavigation;
                        startTran(() => {
                            raiseNavigationEvent(stateContext, intercept, this.stateContext['rscCache']);
                        });
                    })
                }, currentContext);
                if (!navigating) intercept?.commit?.();
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {url, oldState, state, data, oldData, asyncData, historyAction, history, crumbs, oldUrl} = asyncNavigator.stateContext;
        const refresh = state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length;
        const prime = () => {
            const {sceneViews} = intercept;
            if (history && sceneViews && stateNavigator.historyManager.refetch && window.NavigationPrecommitController) {
                const oldSceneViews = window.navigation.currentEntry.getState()?.['sceneViews'] || {};
                const children = {};
                for (const sceneViewKey in sceneViews) (children[sceneViews[sceneViewKey].parent] ||= []).push(sceneViewKey);
                const fetching = (sceneViewKey: string) => {
                    const {keys: refetch} = sceneViews[sceneViewKey];
                    if (!oldSceneViews[sceneViewKey]) return true;
                    if (!refetch) return true;
                    if (refetch.state && state !== oldState) return true;
                    for(let i = 0; i < refetch.data.length; i++) {
                        if (data[refetch.data[i]] !== oldData[refetch.data[i]]) return true;
                    }
                    return false;
                };
                const rscFetching = {};
                const primeChildren = (parent: string) => {
                    for (const sceneViewKey of children[parent] || []) {
                        if (fetching(sceneViewKey)) rscFetching[sceneViewKey] = false;
                        else primeChildren(sceneViewKey);
                    }
                };
                primeChildren(null);
                return rscFetching;
            }
            return Object.keys(rootViews.current).reduce((rscFetching, rootKey) => {
                const active = rootViews.current[rootKey];
                if (getShow(active, state.key) && !getShow(active, oldState?.key)) rscFetching[rootKey] = false;
                return rscFetching;
            }, {});
        };
        const rscFetching = oldUrl && !refresh ? prime() : undefined;
        const stale = (cache.current[crumbs.length]?.stale && cache.current[crumbs.length].stateKey === state.key) || (history && crumbs.length > oldUrl?.split('crumb=').length - 1);
        const nextNavigationEvent = {data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, rscCache, ignoreCache: !!rscCache || stale, rscFetching, hasUAVisualTransition: intercept.hasUAVisualTransition, uncommitted: !oldUrl}, stateNavigator, intercept};
        setNavigationEvent(nextNavigationEvent);
        if (intercept.resume && refresh) setNextNavigationEvent(nextNavigationEvent);
        if (typeof window !== 'undefined' && intercept.resume && window.NavigationPrecommitController && fetchServer && historyAction !== 'none' && !history && (!intercept.commit || intercept.controller)) {
            nextNavigationEvent.data.uncommitted = true;
            if (!intercept.controller) {
                window.navigation.addEventListener('navigate', e => {
                    if (e.info?.stateContext !== asyncNavigator.stateContext) return;
                    e.intercept({
                        focusReset: 'manual',
                        scroll: 'manual',
                        async precommitHandler(controller) {
                            return new Promise((resolve, reject) => {
                                intercept.commit = resolve;
                                intercept.signal = e.signal;
                                if (e.navigationType !== 'traverse') intercept.controller = controller;
                                e.signal.addEventListener('abort', () => {
                                    reject(e.signal.reason)
                                    setTransitionAborted({});
                                });
                            });
                        }
                    });
                }, {once: true});
            }
            const res = stateNavigator.historyManager.navigate(url, historyAction === 'replace', intercept.controller, asyncNavigator.stateContext);
            res?.committed.catch((e) => {
                if (!intercept?.signal?.aborted) throw e;
            });
        }
    }, [stateNavigator, fetchServer]);
    if (!navigationEvent && url && !stateNavigator.stateContext.state) stateNavigator.navigateLink(url, 'replace');
    if (!navigationEvent) raiseNavigationEvent();
    const primeRefetch = (sceneViewKey: string | boolean = true) => {
        if (typeof sceneViewKey === 'string') return {[sceneViewKey]: false};
        const {key} = navigationEvent.data.state;
        return Object.keys(rootViews.current).reduce((rscFetching, rootKey) => {
            if (getShow(rootViews.current[rootKey], key)) rscFetching[rootKey] = false;
            return rscFetching;
        }, {});
    };
    const fetchRSC = useCallback(async (sceneViewKeys: string[], action: (...args: any[]) => any = null, args: any[] = null, navigationEventData: NavigationHandlerState = nextNavigationEvent.data) => {
        const current = navigationEventData === nextNavigationEvent.data;
        const currentStateContext = nextNavigationEvent.stateNavigator.stateContext;
        const {stateContext: nextStateContext, historyManager} = navigationEventData.stateNavigator
        const {url, oldUrl, nextCrumb} = nextStateContext;
        const crumbCache = cache.current[nextStateContext.crumbs.length];
        if (!current && crumbCache?.stateKey === navigationEventData.state.key) crumbCache.stale = false;
        const res = await fetchServer(historyManager.getHref(nextCrumb.crumblessUrl), {
            body: {url, oldUrl, sceneViewKeys, rootViews: rootViews.current, action, args},
            headers: !action ? {'Content-Type': 'application/json'} : undefined,
            signal: current ? nextNavigationEvent.intercept?.signal : undefined
        });
        if (!current) return res.sceneViews;
        const {stateContext: actualStateContext} = nextNavigationEvent.stateNavigator;
        if (actualStateContext !== currentStateContext && actualStateContext !== nextStateContext)
            return !action ? new Promise(() => {}) : res.data;
        const {state: {key}, stateNavigator: {stateContext: {crumbs}}} = nextNavigationEvent.data;
        const invalidate: (string | false | null)[] | true = res.invalidate || [];
        const invalidated = invalidate === true || invalidate.indexOf(null) !== -1 || invalidate.indexOf(key) !== -1 || (invalidate.indexOf(false) !== -1 && sceneViewKeys[0]);
        if (invalidate === true) {
            markStale(true, nextNavigationEvent.data);
            filterPrefetches(() => false);
        } else if (invalidated || invalidate.length) {
            if (invalidated) expireCache(invalidated, crumbs.length);
            for (const scope of invalidate) {
                if (typeof scope === 'string') markStale(scope, nextNavigationEvent.data);
            }
            filterPrefetches(prefetch => (
                invalidate.indexOf(prefetch.stateKey) === -1 && (!invalidated || prefetch.stateKey !== key)
            ));
        }
        if (res.url) {
            nextNavigationEvent.data.stateNavigator.stateContext['rscCache'] = res.sceneViews;
            nextNavigationEvent.data.stateNavigator.navigateLink(res.url, res.historyAction, false, undefined, stateNavigator.stateContext, nextNavigationEvent.intercept);
        } else if (invalidated) {
            startTransition(() => {
                setNavigationEvent({data: {...nextNavigationEvent.data, ignoreCache: invalidated, rscCache: res.sceneViews, rscFetching: undefined, rscFetch: undefined, trackable: undefined}, stateNavigator: nextNavigationEvent.stateNavigator});
            });
        }
        return !action ? !res.url ? res.sceneViews : new Promise(() => {}) : res.data;
    }, [stateNavigator, nextNavigationEvent, fetchServer]);
    const refetchControl = useMemo(() => ({
        invalidator: (scope: boolean | string, sceneViewKey: string, navigationEventData: NavigationHandlerState) => {
            const invalidated = (scope === false && sceneViewKey) || true;
            if (typeof scope === 'string') {
                filterPrefetches(prefetch => prefetch.stateKey !== scope);
                markStale(scope, navigationEvent.data);
                if (scope !== navigationEvent.data.state.key) return;
            } else if (scope === true) {
                markStale(true, navigationEvent.data);
                filterPrefetches(() => false);
            } else {
                expireCache(invalidated, navigationEventData.stateNavigator.stateContext.crumbs.length);
                filterPrefetches(prefetch => prefetch.stateKey !== navigationEventData.state.key);
                if (navigationEventData !== navigationEvent.data) return;
            }
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: invalidated, rscCache: undefined, rscFetching: primeRefetch(invalidated), rscFetch: undefined, trackable: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        },
        registerSceneView: (sceneViewKey: string, active: string | string[]) => {
            rootViews.current[sceneViewKey] = active;
        },
        onInvalidate: (listener: (stateContext: StateContext) => void) => {
            invalidateListeners.current.add(listener);
            return () => invalidateListeners.current.delete(listener);
        },
        isStale: (crumb: number, stateKey: string) => !!cache.current[crumb]?.stale && cache.current[crumb].stateKey === stateKey,
        deserialize: async (sceneViewKey: string, navigationEventData: NavigationHandlerState, action: (...args: any[]) => any = null, args: any[] = null) => {
            if (action) return fetchRSC([sceneViewKey], action, args);
            const {state, data, stateNavigator: {stateContext: {oldUrl}}} = navigationEventData;
            const prefetch = prefetches.current[oldUrl?.split('crumb=').length - 1]?.prefetches.find(({stateKey, navigationData, ready}) => (
                ready && stateKey === state.key
                && Object.keys(navigationData).length === Object.keys(data).length
                && Object.keys(navigationData).every(key => LinkUtility.areEqual(navigationData[key], data[key]))
            ));
            if (prefetch) return prefetch.getItem(sceneViewKey);
            if (!navigationEventData.rscFetch) {
                let resolve: (sceneViewKeys: string[]) => void;
                const promise = new Promise<string[]>(res => resolve = res);
                navigationEventData.rscFetch = {sceneViewKeys: [], resolve, sceneViews: promise.then(sceneViewKeys => fetchRSC(sceneViewKeys, null, null, navigationEventData))};
            }
            const {rscFetch} = navigationEventData;
            rscFetch.sceneViewKeys.push(sceneViewKey);
            const sceneViews = await rscFetch.sceneViews;
            return sceneViews[sceneViewKey];
        },
        getCache: (sceneViewKey: string, navigationEvent: any, cacheable: boolean) => {
            const {state, oldState, stateNavigator: {stateContext: {oldUrl, crumbs}}} = nextNavigationEvent.data;
            const refresh = state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length;
            const {data: navigationData, stateNavigator: {stateContext: navigationContext}} = navigationEvent;
            return cacheable && refresh && [...(cache.current[navigationContext.crumbs.length]?.sceneViews[sceneViewKey]?.entries || [])].reverse().find(entry => (
                entry.navigationData
                && Object.keys(entry.navigationData).every(key => LinkUtility.areEqual(entry.navigationData[key], navigationData[key]))
            ))?.sceneView;
        },
        setCache: (sceneViewKey: string, navigationEvent: any, navigationData: any, sceneView: any, ancestors: string[]) => {
            const crumbCache = cache.current[navigationEvent.stateNavigator.stateContext.crumbs.length];
            if (crumbCache?.stateKey !== navigationEvent.state.key) return;
            const {entries = []} = crumbCache.sceneViews[sceneViewKey] || {};
            const matches = entry => (
                entry.navigationData
                && Object.keys(entry.navigationData).every(key => LinkUtility.areEqual(entry.navigationData[key], navigationData[key]))
            );
            crumbCache.sceneViews[sceneViewKey] = {ancestors: new Set(ancestors), entries: [...entries.filter(entry => !matches(entry)), {navigationData, sceneView}]};
        },
        prefetcher: async (url: string, navigationEvent: any) => {
            const {state: {key: stateKey}, data: navigationData} = stateNavigator.parseLink(url);
            const crumbs = navigationEvent.stateNavigator.stateContext.crumbs.length;
            const crumbPrefetches = prefetches.current[crumbs];
            if (crumbPrefetches?.stateKey !== navigationEvent.state.key) return;
            if (crumbPrefetches.prefetches.some(prefetch => (
                prefetch.stateKey === stateKey
                && Object.keys(prefetch.navigationData).length === Object.keys(navigationData).length
                && Object.keys(prefetch.navigationData).every(key => LinkUtility.areEqual(prefetch.navigationData[key], navigationData[key]))
            ))) return;
            const items = {}, resolvers = {}, rejecters = {};
            const getItem = (key: string) => items[key] ||= new Promise((res, rej) => {
                resolvers[key] = res;
                rejecters[key] = rej;
            });
            const prefetch = {stateKey, navigationData, getItem, ready: false};
            crumbPrefetches.prefetches.push(prefetch);
            try {
                const crumblessUrl = stateNavigator.fluent().navigate(stateKey, navigationData).url;
                const {flattenedSceneViews} = await fetchServer(stateNavigator.historyManager.getHref(crumblessUrl), {
                    body: {url: crumblessUrl, sceneViewKeys: [], rootViews: rootViews.current, prefetch: true},
                    headers: {'Content-Type': 'application/json'}
                });
                if (!flattenedSceneViews) {
                    filterPrefetches(item => item !== prefetch);
                    return;
                }
                prefetch.ready = true;
                for await (const {key, content: sceneView, ancestors} of flattenedSceneViews) {
                    getItem(key);
                    resolvers[key](sceneView);
                    if (prefetches.current[crumbs] !== crumbPrefetches || crumbPrefetches.prefetches.indexOf(prefetch) === -1 || stateKey !== navigationEvent.state.key) continue;
                    const crumbCache = cache.current[crumbs];
                    const {entries = []} = crumbCache.sceneViews[key] || {};
                    const entry = {navigationData: null, sceneView};
                    crumbCache.sceneViews[key] = {ancestors: new Set(ancestors), entries: [...entries, entry]};
                    sceneView.props.keys.then(({data: keys}) => {
                        entry.navigationData = {};
                        for (const key of keys) entry.navigationData[key] = navigationData[key];
                    }, () => {});
                }
            } catch (e) {
                filterPrefetches(item => item !== prefetch);
                for (const key in rejecters) rejecters[key](e);
            }
        },
        trigger: (navigationEventData: NavigationHandlerState) => {
            if (navigationEventData !== nextNavigationEvent.data || navigationEvent === nextNavigationEvent) {
                const fetching = navigationEventData['rscFetching'];
                const startFetch = Object.keys(fetching).every(key => fetching[key]);
                const {rscFetch} = navigationEventData;
                if (!rscFetch) return;
                const send = () => {
                    rscFetch.resolve(rscFetch.sceneViewKeys);
                    navigationEventData.rscFetch = undefined;
                };
                clearTimeout(rscFetch.timeout);
                if (startFetch) send();
                else rscFetch.timeout = setTimeout(() => {
                    for (const key in fetching) fetching[key] = true;
                    send();
                }, 100);
            }
        },
    }), [navigationEvent, nextNavigationEvent, fetchRSC]);
    useEffect(() => {
        const onNavigate = () => {
            if (navigationEvent.stateNavigator === stateNavigator && navigationEvent.data.stateNavigator.stateContext !== stateNavigator.stateContext)
                raiseNavigationEvent();
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent, raiseNavigationEvent]);
    React.useInsertionEffect?.(() => {
        const commit = navigationEvent.intercept?.commit;
        if (!isPending) navigationEvent.data.uncommitted = false;
        const {state, stateNavigator: {stateContext: {crumbs}}} = navigationEvent.data;
        if (!isPending && navigationEvent.intercept && state) {
            const stateKeys = [...crumbs.map(crumb => crumb.state.key), state.key];
            cache.current = stateKeys.map((stateKey, i) => cache.current[i]?.stateKey === stateKey ? cache.current[i] : {stateKey, sceneViews: {}, stale: false});
            cache.current[crumbs.length].stale = false;
            prefetches.current = stateKeys.map((stateKey, i) => prefetches.current[i]?.stateKey === stateKey ? prefetches.current[i] : {stateKey, prefetches: []});
        }
        if (!isPending && commit) {
            commit();
            const title = typeof document !== 'undefined' ? document.title : null;
            const oldTitle = navigationEvent.intercept?.title;
            if (typeof document !== 'undefined' && oldTitle) document.title = oldTitle;
            window.navigation?.addEventListener('navigatesuccess', () => {
                if (typeof document !== 'undefined' && document.title === oldTitle && title) document.title = title;
            }, {once: true});
        }
    }, [isPending, navigationEvent]);
    useLayoutEffect(() => {
        const {commit, scrollY} = navigationEvent.intercept || {};
        if (isPending || !commit || !window.NavigationPrecommitController) return;
        const {state, oldState, crumbs, oldUrl} = navigationEvent.data.stateNavigator.stateContext;
        if (state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length) return;
        window.scrollTo(0, scrollY || 0);
    }, [isPending, navigationEvent]);
    useEffect(() => {
        if (!isPending) {
            const title = typeof document !== 'undefined' ? document.title : null;
            const oldTitle = navigationEvent.intercept?.title;
            if (typeof document !== 'undefined' && oldTitle) document.title = oldTitle;
            if (typeof window !== 'undefined' && window.navigation?.transition) {
                const state = {...window.navigation.currentEntry.getState()};
                window.history.replaceState({...window.history.state}, null);
                window.navigation.updateCurrentEntry({state});
            }
            navigationEvent.intercept?.resume?.();
            if (typeof document !== 'undefined' && document.title === oldTitle && title) document.title = title;
            navigationEvent.intercept = {};
        }
    }, [isPending, navigationEvent]);
    useEffect(() => {
        if (typeof window === 'undefined' || !fetchServer || !window.navigation) return;
        stateNavigator.historyManager.interceptHistory((navigationLink: string, {signal, hasUAVisualTransition, destination}: NavigateEvent) => (
            new Promise((resolve, reject) => {
                const {sceneViews, scrollY} = destination.getState() as any || {};
                const intercept = {commit: resolve, signal, hasUAVisualTransition, sceneViews, scrollY};
                navigationEvent.data.stateNavigator.navigateLink(navigationLink, undefined, true, undefined, undefined, intercept);
                signal.addEventListener('abort', () => {
                    reject(signal.reason);
                    setTransitionAborted({});
                });
            })
        ));
    }, [navigationEvent, stateNavigator.historyManager, fetchServer])
    useEffect(() => {
        const {stateNavigator: oldStateNavigator} = navigationEvent;
        if (stateNavigator !== oldStateNavigator) {
            if (oldStateNavigator.historyManager !== stateNavigator.historyManager)
                oldStateNavigator.historyManager.stop();
            if (!stateNavigator.stateContext.state) {
                const {url, oldUrl} = oldStateNavigator.stateContext;
                const navigateLink = (link: string, historyAction: 'none' | 'replace') => {
                    try {
                        stateNavigator.navigateLink(link, historyAction);
                    } catch {
                        const {state, data, crumbs} = oldStateNavigator.parseLink(link);
                        let fluentNavigator = stateNavigator.fluent();
                        for (const crumb of crumbs)
                            fluentNavigator = fluentNavigator.navigate(crumb.state.key, crumb.data);
                        stateNavigator.navigateLink(fluentNavigator.navigate(state.key, data).url, historyAction);
                    }
                };
                if (oldUrl) navigateLink(oldUrl, 'none');
                navigateLink(url, 'replace');
            }
            raiseNavigationEvent(undefined, undefined, {});
        }
    }, [navigationEvent, stateNavigator]);
    useEffect(() => {
        const offHmrReload = onHmrReload?.(() => {
            markStale(true, navigationEvent.data);
            filterPrefetches(() => false);
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscCache: undefined, rscFetching: primeRefetch(), rscFetch: undefined, trackable: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        });
        return offHmrReload;
    }, [navigationEvent, onHmrReload]);
    return (
        <NavigationContext.Provider value={nextNavigationEvent?.data}>
            <TransitionContext.Provider value={navigationTransition}>
                <RefetchContext.Provider value={refetchControl}>
                    {ssr || !fetchServer ? children : <Suspense fallback={null}>{children}</Suspense>}
                </RefetchContext.Provider>
            </TransitionContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
