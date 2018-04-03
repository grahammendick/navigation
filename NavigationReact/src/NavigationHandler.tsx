import NavigationContext from './NavigationContext';
import { StateNavigator, StateContext, State } from 'navigation';
import * as React from 'react';
type NavigationHandlerState = { context: { oldState: State, state: State, data: any, asyncData: any, stateNavigator: StateNavigator } };

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, NavigationHandlerState> {
    private originalResumeNavigation;
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        this.originalResumeNavigation = stateNavigator['resumeNavigation'];
        this.props.stateNavigator['resumeNavigation'] = this.resumeNavigation.bind(this);
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        this.state = { context: { oldState, state, data, asyncData, stateNavigator } };
    }

    componentWillUnmount() {
        this.props.stateNavigator['resumeNavigation'] = this.originalResumeNavigation;
    }

    private resumeNavigation(stateContext: StateContext, historyAction: 'add' | 'replace' | 'none') {
        var { stateNavigator } = this.props;
        this.setState(() => {
            var nextNavigator = new StateNavigator();
            nextNavigator.states = stateNavigator.states;
            nextNavigator.historyManager = stateNavigator.historyManager;
            nextNavigator['stateHandler'] = stateNavigator['stateHandler'];
            nextNavigator.stateContext = stateContext;
            nextNavigator.configure = stateNavigator.configure.bind(stateNavigator);
            nextNavigator.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
            nextNavigator.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
            nextNavigator.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
            nextNavigator.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            nextNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
            var { oldState, state, data, asyncData } = stateContext;
            return { context: { oldState, state, data, asyncData, stateNavigator: nextNavigator } };
        }, () => {
            if (stateContext.url === this.state.context.stateNavigator.stateContext.url)
                this.originalResumeNavigation.call(stateNavigator, stateContext, historyAction);
        });
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
