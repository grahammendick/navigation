'use client'
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
type NavigationHandlerState = {ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator};

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, stateNavigator: StateNavigator, resumeNavigation?: () => void}>();
    const navigationDeferredEvent = useDeferredValue(navigationEvent);
    const [isPending, startTransition] = useTransition();
    const createNavigationEvent = useCallback(() => {
        const AsyncStateNavigator = class AsyncStateNavigator extends StateNavigator {
            constructor(stateContext: StateContext = stateNavigator.stateContext) {
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
                currentContext = this.stateContext) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        const {oldState, state, history, crumbs} = stateContext;
                        const refresh = oldState === state && crumbs.length === this.stateContext.crumbs.length;
                        const startTran = (!history && !refresh && startTransition) || ((transition) => transition());
                        startTran(() => {
                            const asyncNavigator = new AsyncStateNavigator(stateContext)
                            const {oldState, state, data, asyncData} = asyncNavigator.stateContext;
                            setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator}, stateNavigator, resumeNavigation});
                        });
                    })
                }, currentContext);
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {oldState, state, data, asyncData} = asyncNavigator.stateContext;
        return {data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator}, stateNavigator};
    }, [stateNavigator]);
    if (!navigationEvent) setNavigationEvent(createNavigationEvent());
    const refetch = useCallback(() => {
        startTransition(() => {
            setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true}, stateNavigator: navigationEvent.stateNavigator});
        });
    }, [navigationEvent]);
    const refetchControl = useMemo(() => ({setRefetch: () => {}, refetcher: refetch}), [refetch]);
    useEffect(() => {
        const onNavigate = () => {
            if (navigationEvent.data.stateNavigator.stateContext !== stateNavigator.stateContext)
                setNavigationEvent(createNavigationEvent());
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent, createNavigationEvent]);
    useEffect(() => {
        if (!isPending && navigationEvent === navigationDeferredEvent)
            navigationEvent.resumeNavigation?.();
    }, [isPending, navigationEvent, navigationDeferredEvent]);
    useEffect(() => {
        setNavigationEvent(createNavigationEvent());
    }, [stateNavigator])
    return (
        <NavigationContext.Provider value={navigationEvent?.data}>
            <RefetchContext.Provider value={refetchControl}>
                <NavigationDeferredContext.Provider value={navigationDeferredEvent?.data}>
                    {children}
                </NavigationDeferredContext.Provider>
            </RefetchContext.Provider>
        </NavigationContext.Provider>
    )
}
export default NavigationHandler;
