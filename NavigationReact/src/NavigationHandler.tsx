'use client'
import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { StateNavigator, StateContext, State } from 'navigation';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
type NavigationHandlerState = {ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator};

const NavigationHandler = ({stateNavigator, children}: {stateNavigator: StateNavigator, children: any}) => {
    const [navigationEvent, setNavigationEvent] = useState<{data: NavigationHandlerState, resumeNavigation?: () => void}>();
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
                            setNavigationEvent({data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator}, resumeNavigation});
                        });
                    })
                }, currentContext);
            }
        }
        const asyncNavigator = new AsyncStateNavigator()
        const {oldState, state, data, asyncData} = asyncNavigator.stateContext;
        return {data: {oldState, state, data, asyncData, stateNavigator: asyncNavigator}};
    }, [stateNavigator]);
    if (!navigationEvent) setNavigationEvent(createNavigationEvent());
    const refetch = useCallback(() => {
        startTransition(() => {
            setNavigationEvent({data: {...navigationEvent.data, ignoreCache: true}});
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

/* const NavigationHandlerInner = ({ children }: any) => {
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
} */
export default NavigationHandler;
