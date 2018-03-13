import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    constructor(props) {
        super(props);
        var { stateNavigator } = props;
        stateNavigator.getNavigateContinuation = this.getNavigateContinuation.bind(this);
        stateNavigator.historyManager.init = () => {};
        this.state = { stateNavigator };
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: string, history: boolean): () => void {
        return (asyncData?: any) => {
            this.setState(() => {
                var { stateNavigator } = this.props;
                if (oldUrl === stateNavigator.stateContext.url) {
                    var clonedNavigator = stateNavigator.clone(stateNavigator.historyManager);
                    clonedNavigator.stateContext = stateNavigator.getStateContext(state, data, url, asyncData, history);
                    clonedNavigator.configure = stateNavigator.configure.bind(stateNavigator);
                    clonedNavigator.getNavigateContinuation = stateNavigator.getNavigateContinuation;
                    return { stateNavigator: clonedNavigator };
                }
                return null;
            }, () => {
                var { stateNavigator } = this.state;
                var { stateContext } = stateNavigator;
                this.props.stateNavigator.stateContext = stateContext;
                if (stateContext.oldState && stateContext.oldState !== state)
                    stateContext.oldState.dispose();
                state.navigated(stateContext.data, asyncData);
                if (url === stateContext.url) {
                    if (historyAction !== 'none')
                        stateNavigator.historyManager.addHistory(url, historyAction === 'replace');
                    if (stateContext.title && (typeof document !== 'undefined'))
                        document.title = stateContext.title;
                }
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
