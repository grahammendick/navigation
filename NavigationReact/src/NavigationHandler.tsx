import AsyncStateNavigator from './AsyncStateNavigator';
import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';
import * as ReactDOM from 'react-dom'
type NavigationHandlerState = { context: { oldState: State, state: State, data: any, asyncData: any, nextState: State, nextData: any, stateNavigator: AsyncStateNavigator } };

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, NavigationHandlerState> {
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        var asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
        this.state = { context: { oldState, state, data, asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } };
        this.onAfterNavigate = this.onAfterNavigate.bind(this);
    }

    componentDidMount() {
        this.props.stateNavigator.onAfterNavigate(this.onAfterNavigate);
    }

    componentWillUnmount() {
        this.props.stateNavigator.offAfterNavigate(this.onAfterNavigate);
    }

    onAfterNavigate() {
        var { stateNavigator } = this.props;
        if (this.state.context.stateNavigator.stateContext !== stateNavigator.stateContext) {
            const flushSync = ReactDOM.flushSync || ((setState: () => void) => setState());
            flushSync(() => {
                this.setState(() => {
                    var { oldState, state, data, asyncData } = stateNavigator.stateContext;
                    var asyncNavigator = new AsyncStateNavigator(this, stateNavigator, stateNavigator.stateContext);
                    return { context: { oldState, state, data, asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } };
                });
            })
        }
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
