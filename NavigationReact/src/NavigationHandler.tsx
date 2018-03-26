import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    private navigateHandler: any;
    private originalGetNavigateContinuation;
    constructor(props) {
        super(props);
        var { stateNavigator } = this.props;
        this.navigateHandler = () => this.forceUpdate();
        stateNavigator.onNavigate(this.navigateHandler);
        this.originalGetNavigateContinuation = stateNavigator['getNavigateContinuation'];
        stateNavigator['getNavigateContinuation'] = this.getNavigateContinuation.bind(this);
        this.state = { stateNavigator };
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none', history: boolean): (asyncData?: any) => void {
        var { stateNavigator } = this.props;
        return (asyncData?: any) => {
            this.setState(() => {
                if (oldUrl === stateNavigator.stateContext.url) {
                    var nextNavigator = new StateNavigator();
                    nextNavigator.stateContext = stateNavigator['createStateContext'](state, data, url, asyncData, history);
                    nextNavigator.states = stateNavigator.states;
                    nextNavigator.historyManager = stateNavigator.historyManager;
                    nextNavigator['stateHandler'] = stateNavigator['stateHandler'];
                    nextNavigator.configure = stateNavigator.configure.bind(stateNavigator);
                    nextNavigator.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
                    nextNavigator.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                    nextNavigator.navigateLink = stateNavigator.navigateLink.bind(stateNavigator);
                    return { stateNavigator: nextNavigator };
                }
                return null;
            }, () => {
                if (url === this.state.stateNavigator.stateContext.url) {
                    stateNavigator.stateContext = this.state.stateNavigator.stateContext;
                    stateNavigator.offNavigate(this.navigateHandler);
                    stateNavigator['notify'](historyAction);
                }
            });
        };
    }

    componentWillUnmount() {
        this.state.stateNavigator['getNavigateContinuation'] = this.originalGetNavigateContinuation;
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
