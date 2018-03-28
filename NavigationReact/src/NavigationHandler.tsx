import NavigationContext from './NavigationContext';
import { StateNavigator, StateContext } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    private originalResumeNavigation;
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        this.originalResumeNavigation = stateNavigator['resumeNavigation'];
        this.state = { stateNavigator };
    }

    componentDidMount() {
        this.props.stateNavigator['resumeNavigation'] = this.resumeNavigation.bind(this);
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
            nextNavigator.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
            nextNavigator.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
            nextNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
            return { stateNavigator: nextNavigator };
        }, () => {
            if (stateContext.url === this.state.stateNavigator.stateContext.url)
                this.originalResumeNavigation.call(stateNavigator, stateContext, historyAction);
        });
    }

    render() {
        var { stateNavigator } = this.state;
        var { oldState, state, data, asyncData } = stateNavigator.stateContext;
        return (
            <NavigationContext.Provider value={{ oldState, state, data, asyncData, stateNavigator }}>
                {this.props.children}
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
