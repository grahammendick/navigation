'use client'
import React, { Component, startTransition } from 'react';
import { StateNavigator, State } from 'navigation';
import AsyncStateNavigator from './AsyncStateNavigator.js';
import NavigationContext from './NavigationContext.js';
import SceneRSCContext from './SceneRSCContext.js';
type NavigationHandlerState = { context: { ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: AsyncStateNavigator } };

class NavigationHandler extends Component<{ stateNavigator: StateNavigator, children: any }, NavigationHandlerState> {
    constructor(props) {
        super(props);
        const { stateNavigator } = this.props;
        const { oldState, state, data, asyncData } = stateNavigator.stateContext;
        const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
        this.state = { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
        this.onNavigate = this.onNavigate.bind(this);
        this.refetch = this.refetch.bind(this);
    }

    componentDidMount() {
        this.props.stateNavigator.onNavigate(this.onNavigate);
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
                <SceneRSCContext.Provider value={this.refetch}>
                    {this.props.children}
                </SceneRSCContext.Provider>
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
