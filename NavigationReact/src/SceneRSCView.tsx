'use client'
import React, { createContext, useContext, useEffect, useRef, useMemo, useCallback, Suspense } from 'react';
import { SceneViewProps } from './Props.js';
import useNavigationEvent from './useNavigationEvent.js';
import RefetchContext from './RefetchContext.js';
import HistoryCacheContext from './HistoryCacheContext.js';
import ErrorBoundary from './ErrorBoundary.js';
import TransitionContext from './TransitionContext.js';
import NavigationContext from './NavigationContext.js';

const FetchingContext = createContext<(navigationEvent: any) => boolean>(() => false);

const SceneViewInner = ({children, onMount}) => {
    useEffect(() => {
        onMount();
    }, [onMount]);
    return children
};

const SceneView = ({active, name, parent, rendered, pending, fallback, errorFallback, children}: SceneViewProps & {active: string | string[], parent: string, pending: boolean, rendered: boolean}) => {
    const navigationEvent = useNavigationEvent();
    const {nextNavigationEvent} = useContext(TransitionContext);
    const {state, oldState, stateNavigator: {stateContext}} = navigationEvent;
    const {oldUrl, historyAction, history, crumbs} = stateContext;
    const historyCache = useContext(HistoryCacheContext);
    const {deserialize, trigger, keys} = useContext(RefetchContext) as any;
    const suspended = useRef(null);
    const errored = useRef(null);
    const ancestorFetchingFn = useContext(FetchingContext);
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
    const cachedHistory = !ignoreCache && historyCache.get(navigationEvent, sceneViewKey);
    if (!navigationEvent['rscCache']) navigationEvent['rscCache'] = {};
    const cachedSceneViews = navigationEvent['rscCache'];
    if (cachedHistory) cachedSceneViews[sceneViewKey] = cachedHistory;
    const renderedSceneView = useRef(null);
    const renderedSuspense = useRef(true);
    const suspense = !rendered || !getShow(oldState?.key) ? !history || (state === oldState && oldUrl?.split('crumb=').length - 1 === crumbs.length) : renderedSuspense.current;
    useEffect(() => {
        renderedSuspense.current = suspense;
    }, [suspense]);
    const fetchingFn = useCallback(((navigationEvent) => {
        const {state, oldState, data, stateNavigator: {stateContext}} = navigationEvent;
        const {oldData} = stateContext;
        const refetch = keys.current;
        const cacheIgnorable = navigationEvent['ignoreCache'];
        const ignoreCache = cacheIgnorable === true || cacheIgnorable === sceneViewKey;
        if (!getShow(state?.key)) return false;
        if ((!getShow(oldState?.key) && !cacheIgnorable) || ignoreCache) return true;
        if (navigationEvent['rscCache']?.[sceneViewKey] || suspended.current || errored.current) return true;
        if (!rendered) return true;
        if (cacheIgnorable) return false;
        if (!refetch) return true;
        if (refetch.state && state !== oldState) return true;
        for(let i = 0; i < refetch.data.length; i++) {
            if (data[refetch.data[i]] !== oldData[refetch.data[i]]) return true;
        }
        return false;
    }), [sceneViewKey, keys, rendered]);
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
        return renderedSceneView.current;
    })();
    const combinedFetchingFn = useCallback((navigationEvent) => (
        ancestorFetchingFn(navigationEvent) || fetchingFn(navigationEvent)
    ), [ancestorFetchingFn, fetchingFn]);
    return (
        <ErrorBoundary errorFallback={errorFallback} errorRef={errored}>
            {(() => {
                const view = (
                    <FetchingContext.Provider value={combinedFetchingFn}>
                        <SceneViewInner onMount={() => {
                            renderedSceneView.current = sceneView;
                            if (pending) return;
                            if (historyAction === 'none') return;
                            if (typeof window === 'undefined') return;
                            historyCache.set(navigationEvent, sceneViewKey, renderedSceneView.current);
                            if (!window.navigation?.currentEntry) return;
                            const state = window.navigation.currentEntry.getState() || {};
                            const {[sceneViewKey]: _, ...sceneViews} = state['sceneViews'] || {};
                            if (sceneView) sceneViews[sceneViewKey] = {parent, keys: keys.current};
                            window.navigation.updateCurrentEntry({state: {...state, sceneViews}});
                        }}>{sceneView}</SceneViewInner>
                    </FetchingContext.Provider>
                );
                return fallback && sceneView && suspense ? <Suspense fallback={<div ref={suspended}>{fallback}</div>}>{view}</Suspense> : view;
            })()}
        </ErrorBoundary>
    );
};

const SceneRSCView = (props: SceneViewProps & {active: string | string[]}) => {
    const {active, name} = props;
    const rendered = useRef(false);
    const keys = useRef(null);
    const {sceneViewKey: parent, refetcher, registerSceneView, deserialize, trigger} = useContext(RefetchContext);
    const ancestorNavigationEvent = useNavigationEvent();
    const {navigationEvent, nextNavigationEvent} = useContext(TransitionContext);
    const sceneViewKey = name || (typeof active === 'string' ? active : active[0]);
    useEffect(() => {
        registerSceneView(sceneViewKey, active);
    }, [registerSceneView, sceneViewKey, active]);
    useEffect(() => {
        rendered.current = true;
    }, []);    
    const refetchControl = useMemo(() => ({
        sceneViewKey,
        refetcher: (scene: boolean) => refetcher(scene || sceneViewKey),
        registerSceneView: () => {},
        deserialize,
        trigger,
        keys,
    }), [sceneViewKey, refetcher, deserialize, trigger]);
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
            <RefetchContext.Provider value={refetchControl}>
                <SceneView {...props} parent={parent} rendered={rendered.current} pending={navigationEvent !== nextNavigationEvent} />
            </RefetchContext.Provider>
        </NavigationContext.Provider>
    )
}

export default SceneRSCView;
