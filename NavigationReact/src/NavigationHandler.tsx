'use client'
import React, { useCallback, useContext, useOptimistic, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import TransitionContext from './TransitionContext.js';
import BundlerContext from './BundlerContext.js';
import LinkUtility from './LinkUtility.js';
type Intercept = {resume?: () => void, commit?: () => void, signal?: AbortSignal, title?: string, controller?: NavigationPrecommitController, hasUAVisualTransition?: boolean, sceneViews?: any, scrollY?: number};
type NavigationHandlerState = { ignoreCache?: boolean | string, rscCache?: any, rscFetching?: any, hasUAVisualTransition?: boolean, uncommitted?: boolean, trackable?: any, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator & { navigateLink: (...args: [...Parameters<StateNavigator['navigateLink']>, Intercept?]) => void } };
type RSCFetch = {sceneViewKeys: string[], resolve: (sceneViewKeys: string[]) => void, sceneViews: Promise<any>, timeout?: ReturnType<typeof setTimeout>};

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, intercept?: Intercept, rscFetch?: RSCFetch}>();
    const [_nextNavigationEvent, setNextNavigationEvent] = useOptimistic?.(navigationEvent) || [navigationEvent, () => {}];
    const [isPending, startTransition] = useTransition?.() || [false];
    const [, setTransitionAborted] = useState({});
    const nextNavigationEvent = !_nextNavigationEvent?.intercept?.signal?.aborted ? _nextNavigationEvent : navigationEvent;
    const navigationTransition = useMemo(() => ({navigationEvent: navigationEvent?.data, nextNavigationEvent: nextNavigationEvent?.data}), [navigationEvent, nextNavigationEvent]);
    const rootViews = useRef({});
    const getShow = (active: string | string[], key: string) => (
        active != null && (typeof active === 'string' ? key === active : active.indexOf(key) !== -1)
    );
    const cache = useRef({});
    const prefetches = useRef([]);
    const expireCache = (sceneViewKey: string | boolean) => {
        for (const key in cache.current) {
            if (sceneViewKey === true || cache.current[key].ancestors.has(sceneViewKey)) delete cache.current[key];
        }
    };
    const {createTemporaryReferenceSet, encodeReply, createFromFetch, onHmrReload} = useContext(BundlerContext);
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
                        intercept.title = typeof document !== 'undefined' && createFromFetch ? document.title : null;
                        if (typeof window !== 'undefined' && createFromFetch && window.navigation?.currentEntry) window.navigation.updateCurrentEntry({state: {...window.navigation.currentEntry.getState(), scrollY: window.scrollY}});
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
        const nextNavigationEvent = {data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator, rscCache, ignoreCache: !!rscCache, rscFetching, hasUAVisualTransition: intercept.hasUAVisualTransition, uncommitted: !oldUrl}, stateNavigator, intercept};
        setNavigationEvent(nextNavigationEvent);
        if (intercept.resume && refresh) setNextNavigationEvent(nextNavigationEvent);
        if (typeof window !== 'undefined' && intercept.resume && window.NavigationPrecommitController && createFromFetch && historyAction !== 'none' && !history && (!intercept.commit || intercept.controller)) {
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
    }, [stateNavigator, createFromFetch]);
    if (!navigationEvent) raiseNavigationEvent();
    const primeRefetch = (sceneViewKey: string | boolean = true) => {
        if (typeof sceneViewKey === 'string') return {[sceneViewKey]: false};
        const {key} = navigationEvent.data.state;
        return Object.keys(rootViews.current).reduce((rscFetching, rootKey) => {
            if (getShow(rootViews.current[rootKey], key)) rscFetching[rootKey] = false;
            return rscFetching;
        }, {});
    };
    const fetchRSC = useCallback(async (sceneViewKeys: string[], actionId: string = null, args: any[] = null) => {
        const currentStateContext = nextNavigationEvent.stateNavigator.stateContext;
        const {stateContext: nextStateContext, historyManager} = nextNavigationEvent.data.stateNavigator
        const {url, oldUrl, nextCrumb} = nextStateContext;
        const responsePromise = (async () => {
            let response = null;
            try {
                const temporaryReferences = createTemporaryReferenceSet();
                response = await fetch(historyManager.getHref(nextCrumb.crumblessUrl), {
                    method: 'post',
                    headers: {Accept: 'text/x-component', ...(!actionId ? {'Content-Type': 'application/json'} : undefined)},
                    body: await encodeReply({url, oldUrl, sceneViewKeys, rootViews: rootViews.current, actionId, args}, {temporaryReferences}),
                    signal: nextNavigationEvent.intercept?.signal
                });
            } catch(e) {
                if (!nextNavigationEvent.intercept?.signal?.aborted) throw e;
                else return new Promise(() => {}) as Promise<Response>;
            }
            const reader = response.body.getReader();
            const customStream = new ReadableStream({
                async pull(controller) {
                    try {
                        const {done, value} = await reader.read();
                        if (!done) controller.enqueue(value);
                        else controller.close();
                    } catch(e) {
                        if (!nextNavigationEvent.intercept?.signal?.aborted) controller.error(e);
                    }
                }
            });
            return new Response(customStream, {headers: response.headers});
        })();
        const res = await createFromFetch(responsePromise);
        const {stateContext: actualStateContext} = nextNavigationEvent.stateNavigator;
        if (actualStateContext !== currentStateContext && actualStateContext !== nextStateContext)
            return !actionId ? new Promise(() => {}) : res.data;
        if (res.url) {
            nextNavigationEvent.data.stateNavigator.stateContext['rscCache'] = res.sceneViews;
            nextNavigationEvent.data.stateNavigator.navigateLink(res.url, res.historyAction, false, undefined, stateNavigator.stateContext, nextNavigationEvent.intercept);
        } else if (actionId && res.refetch) {
            expireCache(res.refetch === true || res.refetch[0]);
            prefetches.current = prefetches.current.filter(prefetch => prefetch.stateKey !== nextNavigationEvent.data.state.key);
            startTransition(() => {
                setNavigationEvent({data: {...nextNavigationEvent.data, ignoreCache: res.refetch === true || res.refetch[0], rscCache: res.sceneViews, rscFetching: undefined, trackable: undefined}, stateNavigator: nextNavigationEvent.stateNavigator});
            });
        }
        return !actionId ? !res.url ? res.sceneViews : new Promise(() => {}) : res.data;
    }, [stateNavigator, nextNavigationEvent, createTemporaryReferenceSet, encodeReply, createFromFetch]);
    const refetchControl = useMemo(() => ({
        refetcher: (sceneViewKey: string | boolean = true) => {
            expireCache(sceneViewKey);
            prefetches.current = prefetches.current.filter(prefetch => prefetch.stateKey !== navigationEvent.data.state.key);
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: sceneViewKey, rscCache: undefined, rscFetching: primeRefetch(sceneViewKey), trackable: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        },
        registerSceneView: (sceneViewKey: string, active: string | string[]) => {
            rootViews.current[sceneViewKey] = active;
        },
        deserialize: async (sceneViewKey: string, actionId: string = null, args: any[] = null) => {
            if (actionId) return fetchRSC([sceneViewKey], actionId, args);
            const {state, data} = nextNavigationEvent.data;
            const prefetch = prefetches.current.find(({stateKey, navigationData, ready}) => (
                ready && stateKey === state.key
                && Object.keys(navigationData).length === Object.keys(data).length
                && Object.keys(navigationData).every(key => LinkUtility.areEqual(navigationData[key], data[key]))
            ));
            if (prefetch) return prefetch.getItem(sceneViewKey);
            if (!nextNavigationEvent.rscFetch) {
                let resolve: (sceneViewKeys: string[]) => void;
                const promise = new Promise<string[]>(res => resolve = res);
                nextNavigationEvent.rscFetch = {sceneViewKeys: [], resolve, sceneViews: promise.then(sceneViewKeys => fetchRSC(sceneViewKeys))};
            }
            const {rscFetch} = nextNavigationEvent;
            rscFetch.sceneViewKeys.push(sceneViewKey);
            const sceneViews = await rscFetch.sceneViews;
            return sceneViews[sceneViewKey];
        },
        getCache: (sceneViewKey: string, navigationData: any, cacheable: boolean) => {
            const {state, oldState, stateNavigator: {stateContext: {oldUrl, crumbs}}} = nextNavigationEvent.data;
            const refresh = state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length;
            return cacheable && refresh && [...(cache.current[sceneViewKey]?.entries || [])].reverse().find(entry => (
                entry.navigationData
                && Object.keys(entry.navigationData).every(key => LinkUtility.areEqual(entry.navigationData[key], navigationData[key]))
            ))?.sceneView;
        },
        setCache: (sceneViewKey: string, navigationData: any, sceneView: any, ancestors: string[]) => {
            const {entries = []} = cache.current[sceneViewKey] || {};
            const matches = entry => (
                entry.navigationData
                && Object.keys(entry.navigationData).every(key => LinkUtility.areEqual(entry.navigationData[key], navigationData[key]))
            );
            cache.current[sceneViewKey] = {ancestors: new Set(ancestors), entries: [...entries.filter(entry => !matches(entry)), {navigationData, sceneView}]};
        },
        prefetcher: async (url: string) => {
            const {state: {key: stateKey}, data: navigationData} = stateNavigator.parseLink(url);
            if (prefetches.current.some(prefetch => (
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
            prefetches.current.push(prefetch);
            try {
                const crumblessUrl = stateNavigator.fluent().navigate(stateKey, navigationData).url;
                const temporaryReferences = createTemporaryReferenceSet();
                const response = fetch(stateNavigator.historyManager.getHref(crumblessUrl), {
                    method: 'post',
                    headers: {Accept: 'text/x-component', 'Content-Type': 'application/json'},
                    body: await encodeReply({url: crumblessUrl, sceneViewKeys: [], rootViews: rootViews.current, prefetch: true}, {temporaryReferences})
                });
                const {flattenedSceneViews} = await createFromFetch(response);
                if (!flattenedSceneViews) {
                    prefetches.current = prefetches.current.filter(item => item !== prefetch);
                    return;
                }
                prefetch.ready = true;
                for await (const {key, content: sceneView, ancestors} of flattenedSceneViews) {
                    getItem(key);
                    resolvers[key](sceneView);
                    if (prefetches.current.indexOf(prefetch) === -1 || stateKey !== navigationEvent.data.state.key) continue;
                    const {entries = []} = cache.current[key] || {};
                    const entry = {navigationData: null, sceneView};
                    cache.current[key] = {ancestors: new Set(ancestors), entries: [...entries, entry]};
                    sceneView.props.keys.then(({data: keys}) => {
                        entry.navigationData = {};
                        for (const key of keys) entry.navigationData[key] = navigationData[key];
                    }, () => {});
                }
            } catch (e) {
                prefetches.current = prefetches.current.filter(item => item !== prefetch);
                for (const key in rejecters) rejecters[key](e);
            }
        },
        trigger: (navigationEventData: NavigationHandlerState) => {
            if (navigationEvent === nextNavigationEvent && navigationEventData === nextNavigationEvent.data) {
                const fetching = nextNavigationEvent.data['rscFetching'];
                const startFetch = Object.keys(fetching).every(key => fetching[key]);
                const {rscFetch} = nextNavigationEvent;
                if (!rscFetch) return;
                const send = () => {
                    rscFetch.resolve(rscFetch.sceneViewKeys);
                    nextNavigationEvent.rscFetch = undefined;
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
            if (navigationEvent.data.stateNavigator.stateContext !== stateNavigator.stateContext)
                raiseNavigationEvent();
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent, raiseNavigationEvent]);
    React.useInsertionEffect?.(() => {
        const commit = navigationEvent.intercept?.commit;
        if (!isPending) navigationEvent.data.uncommitted = false;
        const {state, oldState, stateNavigator: {stateContext: {oldUrl, crumbs}}} = navigationEvent.data;
        const refresh = state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length;
        if (!isPending && navigationEvent.intercept && !refresh) {
            prefetches.current = [];
            cache.current = {};
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
        if (typeof window === 'undefined' || !createFromFetch || !window.navigation) return;
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
    }, [navigationEvent, stateNavigator.historyManager, createFromFetch])
    useEffect(() => {
        if (stateNavigator !== navigationEvent.stateNavigator)
            raiseNavigationEvent(undefined, undefined, {});
    }, [navigationEvent, stateNavigator]);
    useEffect(() => {
        const offHmrReload = onHmrReload?.(() => {
            expireCache(true);
            prefetches.current = [];
            startTransition(() => {
                setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true, rscCache: undefined, rscFetching: primeRefetch(), trackable: undefined}, stateNavigator: navigationEvent.stateNavigator});
            });
        });
        return offHmrReload;
    }, [navigationEvent, onHmrReload]);
    return (
        <NavigationContext.Provider value={nextNavigationEvent?.data}>
            <TransitionContext.Provider value={navigationTransition}>
                <RefetchContext.Provider value={refetchControl}>
                    {children}
                </RefetchContext.Provider>
            </TransitionContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
