'use client'
import React, { useContext, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import RefetchContext from './RefetchContext.js';
import SceneViewContext from './SceneViewContext.js';
import useRootViewRegistry from './useRootViewRegistry.js';
import ErrorBoundary from './ErrorBoundary.js';
import TransitionContext from './TransitionContext.js';
import NavigationContext from './NavigationContext.js';

const SceneViewInner = ({children, onMount}) => {
    useEffect(() => {
        onMount();
    }, [onMount]);
    return children
};

const SceneView = ({active, name, parent, rendered, pending, fallback, errorFallback, cache, keys, children}: SceneViewProps & {active: string | string[], parent: string, pending: boolean, rendered: boolean, keys: any}) => {
    const navigationEvent = useNavigationEvent();
    const {nextNavigationEvent} = useContext(TransitionContext);
    const {state, oldState, stateNavigator: {stateContext, historyManager}} = navigationEvent;
    const {oldUrl, historyAction, history, crumbs} = stateContext;
    const {deserialize, trigger, getCache, setCache} = useContext(RefetchContext);
    const suspended = useRef(null);
    const errored = useRef(null);
    const {fetchingFn: ancestorFetchingFn} = useContext(SceneViewContext);
    const ancestorFetching = ancestorFetchingFn(navigationEvent);
    const ancestorFetchingNext = ancestorFetchingFn(nextNavigationEvent);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const cacheIgnorable = navigationEvent['ignoreCache'];
    const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
    if (!navigationEvent['rscCache']) navigationEvent['rscCache'] = {};
    const cachedSceneViews = navigationEvent['rscCache'];
    if (!navigationEvent['trackable']) navigationEvent['trackable'] = {};
    if (navigationEvent['uncommitted'] && getShow(state?.key)) navigationEvent['trackable'][sceneViewKey] = true;
    const renderedSceneView = useRef(null);
    const renderedUrl = useRef(null);
    const renderedSuspense = useRef(true);
    const suspense = !rendered || !getShow(oldState?.key) ? !history || (state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length) || !historyManager.refetch || typeof window === 'undefined' || !window.NavigationPrecommitController : renderedSuspense.current;
    useEffect(() => {
        renderedSuspense.current = suspense;
    }, [suspense]);
    const fetchingFn = useCallback(((navigationEvent) => {
        const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
        const {url, oldData} = stateContext;
        const refetch = keys.current;
        const cacheIgnorable = navigationEvent['ignoreCache'];
        const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
        if (!getShow(state?.key)) return false;
        if (navigationEvent['rscCache']?.[sceneViewKey] || suspended.current || errored.current) return true;
        if (!ignoreCache && renderedSceneView.current && renderedUrl.current === url) return false;
        if (!ignoreCache && cache && getCache(sceneViewKey, data)) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || ignoreCache) return true;
        if (!rendered) return true;
        if (cacheIgnorable) return false;
        if (!refetch) return true;
        if (refetch.state && state !== oldState) return true;
        for(let i = 0; i < refetch.data.length; i++) {
            if (data[refetch.data[i]] !== oldData[refetch.data[i]]) return true;
        }
        return false;
    }), [sceneViewKey, keys, rendered, cache, getCache]);
    const fetching = fetchingFn(navigationEvent);
    const fetchingNext = fetchingFn(nextNavigationEvent);
    const firstScene = !oldUrl && !ignoreCache;
    if (!cachedSceneViews[sceneViewKey] && !firstScene && !ancestorFetching && fetching) {
        cachedSceneViews[sceneViewKey] = deserialize(sceneViewKey);
    }
    if (!nextNavigationEvent['rscFetching']) nextNavigationEvent['rscFetching'] = {};
    if (!ancestorFetching && fetching) navigationEvent['rscFetching'][sceneViewKey] = true;
    if (!ancestorFetchingNext && fetchingNext) nextNavigationEvent['rscFetching'][sceneViewKey] ||= false;
    trigger(nextNavigationEvent);
    const sceneView = (() => {
        if (!getShow(state?.key)) return null;
        if (cachedSceneViews[sceneViewKey]) return cachedSceneViews[sceneViewKey];
        if (firstScene || ancestorFetching) return children;
        return (!ignoreCache && cache && getCache(sceneViewKey, navigationEvent.data)) || renderedSceneView.current;
    })();
    const combinedFetchingFn = useCallback((navigationEvent) => (
        ancestorFetchingFn(navigationEvent) || fetchingFn(navigationEvent)
    ), [ancestorFetchingFn, fetchingFn]);
    const sceneViewContext = useMemo(() => ({
        sceneViewKey, fetchingFn: combinedFetchingFn, keys, cache
    }), [sceneViewKey, combinedFetchingFn, keys, cache]);
    return (
        <ErrorBoundary errorFallback={errorFallback} errorRef={errored}>
            {(() => {
                const view = (
                    <SceneViewContext.Provider value={sceneViewContext}>
                        <SceneViewInner onMount={() => {
                            renderedSceneView.current = sceneView;
                            renderedUrl.current = stateContext.url;
                            if (pending) return;
                            if (cache && sceneView && keys.current) {
                                const navigationData = {};
                                for (const key of keys.current.data) navigationData[key] = navigationEvent.data[key];
                                setCache(sceneViewKey, navigationData, sceneView, cache);
                            }
                            if (historyAction === 'none') return;
                            if (typeof window === 'undefined') return;
                            if (!sceneView || !navigationEvent['trackable'][sceneViewKey] || !historyManager.refetch || !window.navigation?.currentEntry) return;
                            const state = window.navigation.currentEntry.getState() || {};
                            const sceneViews = {...state['sceneViews'], [sceneViewKey]: {parent, keys: keys.current}};
                            window.navigation.updateCurrentEntry({state: {...state, sceneViews}});
                        }}>{sceneView}</SceneViewInner>
                    </SceneViewContext.Provider>
                );
                return fallback && sceneView && suspense ? <Suspense fallback={<div ref={suspended}>{fallback}</div>}>{view}</Suspense> : view;
            })()}
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {active, name, cache} = props;
    const rendered = useRef(false);
    const keys = useRef(null);
    const {sceneViewKey: parent, cache: ancestorCache} = useContext(SceneViewContext);
    const registerSceneView = useRootViewRegistry();
    const ancestorNavigationEvent = useNavigationEvent();
    const {navigationEvent, nextNavigationEvent} = useContext(TransitionContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    useEffect(() => {
        rendered.current = true;
    }, []);    
    const {state, data, oldState, stateNavigator: {stateContext}} = nextNavigationEvent;
    const {oldData} = stateContext;
    const getShow = (stateKey: string) => (
        active != null && state && (
            typeof active === 'string' ? stateKey === active : active.indexOf(stateKey) !== -1
        )
    );
    const refetch = keys.current;
    const optimistic = (() => {
        if (!rendered.current) return true;
        if (!getShow(state?.key) || !getShow(oldState?.key) || !refetch) return false;
        if (refetch.state && state !== oldState) return false;
        for(let i = 0; i < refetch.data.length; i++) {
            if (data[refetch.data[i]] !== oldData[refetch.data[i]]) return false;
        }
        return true;
    })();
    return (
        <NavigationContext.Provider value={optimistic ? ancestorNavigationEvent : navigationEvent}>
            <SceneView {...props} cache={cache ?? ancestorCache} keys={keys} parent={parent} rendered={rendered.current} pending={navigationEvent !== nextNavigationEvent} />
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
