'use client'
import React, { Component, startTransition, useDeferredValue, useEffect, useRef, useState } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import useNavigationEvent from './useNavigationEvent.js';
type NavigationHandlerState = {ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator};

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<NavigationHandlerState>();
    const createNavigationEvent = (stateContext: StateContext = stateNavigator.stateContext) => {
        const AsyncStateNavigator = class AsyncStateNavigator extends StateNavigator {
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
                currentContext = this.stateContext) {
                if (!suspendNavigation)
                    suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
                stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
                    suspendNavigation(stateContext, () => {
                        const {oldState, state, history, crumbs} = stateContext;
                        const refresh = oldState === state && crumbs.length === this.stateContext.crumbs.length;
                        const startTransition = (!history && !refresh && React.startTransition) || ((transition) => transition());
                        startTransition(() => {
                            setNavigationEvent(createNavigationEvent(stateContext));
                        });
                    })
                }, currentContext);
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {oldState, state, data, asyncData} = asyncNavigator.stateContext;
        return {oldState, state, data, asyncData, stateNavigator: asyncNavigator};
    }
    if (!navigationEvent) setNavigationEvent(createNavigationEvent());
    useEffect(() => {
        const onNavigate = () => {
            if (navigationEvent.stateNavigator.stateContext !== stateNavigator.stateContext)
                setNavigationEvent(createNavigationEvent());
        };
        stateNavigator.onNavigate(onNavigate);
        return () => stateNavigator.offNavigate(onNavigate);
    }, [stateNavigator, navigationEvent]);
    return (
        <NavigationContext.Provider value={navigationEvent}>
            <RefetchContext.Provider value={this.refetchControl}>
                <NavigationHandlerInner>
                    {children}
                </NavigationHandlerInner>
            </RefetchContext.Provider>
        </NavigationContext.Provider>
    )
}
const NavigationHandlerInner = ({ children }: any) => {
    const navigationEvent = useNavigationEvent();
    const navigationDeferredEvent = useDeferredValue(navigationEvent);
    return (
        <NavigationDeferredContext.Provider value={navigationDeferredEvent}>{children}</NavigationDeferredContext.Provider>
    );
}

class NavigationHandler extends Component<{ stateNavigator: StateNavigator, children: any }, NavigationHandlerState> {
    private refetchControl = {setRefetch: () => {}, refetcher: () => {}};
    constructor(props) {
        super(props);
        const { stateNavigator } = this.props;
        const { oldState, state, data, asyncData } = stateNavigator.stateContext;
        const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
        this.state = { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
        this.onNavigate = this.onNavigate.bind(this);
        this.refetch = this.refetch.bind(this);
        this.refetchControl.refetcher = this.refetch;
    }

    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.onNavigate);
    }

    componentDidUpdate({ stateNavigator: prevStateNavigator }: { stateNavigator: StateNavigator }) {
        const { stateNavigator } = this.props;
        if (stateNavigator !== prevStateNavigator) {
            const { oldState, state, data, asyncData } = stateNavigator.stateContext;
            const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
            this.setState({ context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } });
        }
    }

    componentWillUnmount() {
        this.props.stateNavigator.offNavigate(this.onNavigate);
    }

    onNavigate() {
        const { stateNavigator } = this.props;
        const { stateContext } = stateNavigator;
        if (this.state.context.stateNavigator.stateContext !== stateContext) {
            const { oldState, state, data, asyncData } = stateContext;
            const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateContext);
            this.setState({ context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } });
        }
    }

    refetch() {
        startTransition(() => {
            this.setState({ context: { ...this.state.context, ignoreCache: true } });
        });
    }

    render() {
        return (
            <NavigationContext.Provider value={this.state.context}>
                <RefetchContext.Provider value={this.refetchControl}>
                    <NavigationHandlerInner>
                        {this.props.children}
                    </NavigationHandlerInner>
                </RefetchContext.Provider>
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
