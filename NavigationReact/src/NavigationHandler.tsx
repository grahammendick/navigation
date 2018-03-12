import NavigationContext from './NavigationContext';
import { StateNavigator, State } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    constructor(props) {
        super(props);
        this.getNavigateContinuation = this.getNavigateContinuation.bind(this);
        this.props.stateNavigator.getNavigateContinuation = this.getNavigateContinuation;
        this.props.stateNavigator.historyManager.init = () => {};
        this.state = { stateNavigator: this.props.stateNavigator };
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none', history: boolean): () => void {
        return (asyncData?: any) => {
            this.setState(({ stateNavigator: prevStateNavigator }) => {
                if (oldUrl === prevStateNavigator.stateContext.url) {
                    var stateNavigator = prevStateNavigator.clone(prevStateNavigator.historyManager);
                    stateNavigator.stateContext = prevStateNavigator.getStateContext(state, data, url, asyncData, history);
                    stateNavigator.getNavigateContinuation = this.getNavigateContinuation;
                    return { stateNavigator };
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
