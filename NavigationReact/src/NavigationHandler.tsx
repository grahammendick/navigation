'use client'
import { Component } from 'react';
import AsyncStateNavigator from './AsyncStateNavigator';
import NavigationContext from './NavigationContext';
import BundlerContext from './BundlerContext';
import { StateNavigator, State } from 'navigation';
type NavigationHandlerState = { context: { oldState: State, state: State, data: any, asyncData: any, stateNavigator: AsyncStateNavigator } };

class NavigationHandler extends Component<{ stateNavigator: StateNavigator, fetchRSC: any, children: any }, NavigationHandlerState> {
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        var asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
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
        var { stateNavigator } = this.props;
        if (this.state.context.stateNavigator.stateContext !== stateNavigator.stateContext) {
            this.setState(() => {
                var { oldState, state, data, asyncData } = stateNavigator.stateContext;
                var asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
                return { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
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
