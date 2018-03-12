import NavigationContext from './NavigationContext';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateNavigator: StateNavigator }> {
    constructor(props) {
        super(props);
        this.getNavigateContinuation = this.getNavigateContinuation.bind(this);
        this.props.stateNavigator.getNavigateContinuation = this.getNavigateContinuation;
        this.state = {stateNavigator: this.props.stateNavigator};
    }

    private getStateContext(state: State, data: any, url: string, asyncData: any, history: boolean) {
        var stateContext = new StateContext();
        stateContext.oldState = this.state.stateNavigator.stateContext.state;
        stateContext.oldData = this.state.stateNavigator.stateContext.data;
        stateContext.oldUrl = this.state.stateNavigator.stateContext.url;
        stateContext.state = state;
        stateContext.url = url;
        stateContext.asyncData = asyncData;
        stateContext.title = state.title;
        stateContext.history = history;
        stateContext.crumbs = data[state.crumbTrailKey];
        delete data[state.crumbTrailKey];
        stateContext.data = data;
        stateContext.nextCrumb = new Crumb(data, state, url, this.props.stateNavigator.fluent().navigate(state.key, data).url, false);
        stateContext.previousState = null;
        stateContext.previousData = {};
        stateContext.previousUrl = null;
        if (stateContext.crumbs.length > 0) {
            var previousStateCrumb = stateContext.crumbs.slice(-1)[0];
            stateContext.previousState = previousStateCrumb.state;
            stateContext.previousData = previousStateCrumb.data;
            stateContext.previousUrl = previousStateCrumb.url;
        }
        return stateContext;
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none', history: boolean): () => void {
        return (asyncData?: any) => {
            this.setState(({stateNavigator: prevStateNavigator}) => {
                if (oldUrl === prevStateNavigator.stateContext.url) {
                    var stateNavigator = this.props.stateNavigator.clone();
                    stateNavigator.stateContext = this.getStateContext(state, data, url, asyncData, history);
                    stateNavigator.getNavigateContinuation = this.getNavigateContinuation;
                    return {stateNavigator};
                }
                return null;    
            }, () => {
                var {stateContext} = this.state.stateNavigator;
                this.props.stateNavigator.stateContext = stateContext;
                if (stateContext.oldState && stateContext.oldState !== state)
                    stateContext.oldState.dispose();
                state.navigated(stateContext.data, asyncData);
                if (url === stateContext.url) {
                    if (historyAction !== 'none')
                        this.props.stateNavigator.historyManager.addHistory(url, historyAction === 'replace');
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
