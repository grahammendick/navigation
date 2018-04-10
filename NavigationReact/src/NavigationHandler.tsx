import AsyncStateNavigator from './AsyncStateNavigator';
import NavigationContext from './NavigationContext';
import { StateNavigator, StateContext, State } from 'navigation';
import * as React from 'react';
type NavigationHandlerState = { context: { oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator } };

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, NavigationHandlerState> {
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        var asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
        this.state = { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
    }

    render() {
        return (
            <NavigationContext.Provider value={this.state.context}>
                {this.props.children}
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
