import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    private navigateHandler;
    private originalResumeNavigation;
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        this.originalResumeNavigation = stateNavigator['resumeNavigation'].bind(stateNavigator);
        this.state = { stateNavigator };
    }

    componentDidMount() {
        this.props.stateNavigator['resumeNavigation'] = this.resumeNavigation.bind(this);
    }

    componentWillUnmount() {
        this.props.stateNavigator['resumeNavigation'] = this.originalResumeNavigation;
    }

    private resumeNavigation(oldUrl, state, data, asyncData, url, historyAction, history) {
        var { stateNavigator } = this.props;
        this.setState(() => {
            if (oldUrl === stateNavigator.stateContext.url) {
                var nextNavigator = new StateNavigator();
                nextNavigator.states = stateNavigator.states;
                nextNavigator.historyManager = stateNavigator.historyManager;
                nextNavigator['stateHandler'] = stateNavigator['stateHandler'];
                nextNavigator.stateContext = stateNavigator['createStateContext'](state, {...data}, url, asyncData, history);
                nextNavigator.configure = stateNavigator.configure.bind(stateNavigator);
                nextNavigator.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
                nextNavigator.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                nextNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
                return { stateNavigator: nextNavigator };
            }
            return null;
        }, () => {
            this.originalResumeNavigation(oldUrl, state, data, asyncData, url, historyAction, history);
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
