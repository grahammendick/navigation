import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    constructor(props) {
        super(props);
        var { stateNavigator } = props;
        stateNavigator.getNavigateContinuation = this.getNavigateContinuation.bind(this);
        this.state = { stateNavigator };
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none', history: boolean): () => void {
        return (asyncData?: any) => {
            this.setState(() => {
                var { stateNavigator } = this.props;
                if (oldUrl === stateNavigator.stateContext.url) {
                    stateNavigator.historyManager.init = () => {};
                    var clonedNavigator: StateNavigator = stateNavigator.clone(stateNavigator.historyManager);
                    clonedNavigator.stateContext = stateNavigator.createStateContext(state, data, url, asyncData, history);
                    clonedNavigator.configure = stateNavigator.configure.bind(stateNavigator);
                    clonedNavigator.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
                    clonedNavigator.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
                    clonedNavigator.getNavigateContinuation = stateNavigator.getNavigateContinuation;
                    return { stateNavigator: clonedNavigator };
                }
                return null;
            }, () => {
                this.props.stateNavigator.stateContext = this.state.stateNavigator.stateContext;
                this.props.stateNavigator.dispatchNavigation(historyAction);
            });
        };
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
