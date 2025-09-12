'use client'
import React, { Component, startTransition, useDeferredValue } from 'react';
import { StateNavigator, State } from 'navigation';
import AsyncStateNavigator from './AsyncStateNavigator.js';
import NavigationContext from './NavigationContext.js';
import RefetchContext from './RefetchContext.js';
import NavigationDeferredContext from './NavigationDeferredContext.js';
import useNavigationEvent from './useNavigationEvent.js';
type NavigationHandlerState = { context: { ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: AsyncStateNavigator } };

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
