'use client'
import React, { Component } from 'react';
import { StateNavigator, State } from 'navigation';
import AsyncStateNavigator from './AsyncStateNavigator.js';
import NavigationContext from './NavigationContext.js';
import BundlerContext from './BundlerContext.js';
type NavigationHandlerState = { context: { ignoreCache?: boolean, oldState: State, state: State, data: any, asyncData: any, stateNavigator: AsyncStateNavigator } };

class NavigationHandler extends Component<{ stateNavigator: StateNavigator, fetchRSC: any, children: any }, NavigationHandlerState> {
    constructor(props) {
        super(props);
        const { stateNavigator } = this.props;
        const { oldState, state, data, asyncData } = stateNavigator.stateContext;
        const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
        this.state = { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
        this.onNavigate = this.onNavigate.bind(this);
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
            const { history, oldState, state, data, asyncData } = stateContext;
            const asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateContext);
            const startTransition = React.startTransition || ((transition) => transition());
            this.setState({ context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } }, () => {
                if (stateNavigator.stateContext === stateContext && history) {
                    startTransition(() => {
                        this.setState({ context: { ignoreCache: true, oldState, state, data, asyncData, stateNavigator: asyncNavigator } });
                    });
                }
            });
        }
    }

    render() {
        return (
            <NavigationContext.Provider value={this.state.context}>
                <BundlerContext.Provider value={this.props.fetchRSC}>
                    {this.props.children}
                </BundlerContext.Provider>
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
