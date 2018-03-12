import NavigationContext from './NavigationContext';
import { StateNavigator, StateContext, State, Crumb } from 'navigation';
import * as React from 'react';

class NavigationHandler extends React.Component<{ stateNavigator: StateNavigator }, { stateContext: StateContext }> {
    constructor(props) {
        super(props);
        this.navigateLink = this.navigateLink.bind(this);
        this.props.stateNavigator.navigateLink = this.navigateLink;
        this.getNavigateContinuation = this.getNavigateContinuation.bind(this);
        this.state = {stateContext: this.props.stateNavigator.stateContext};
    }

    private getStateContext(state: State, data: any, url: string, asyncData: any, history: boolean) {
        var stateContext = new StateContext();
        stateContext.oldState = this.state.stateContext.state;
        stateContext.oldData = this.state.stateContext.data;
        stateContext.oldUrl = this.state.stateContext.url;
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

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false) {
        if (history && this.state.stateContext.url === url)
            return;
        var oldUrl = this.state.stateContext.url;
        var { state, data } = this.props.stateNavigator.parseLink(url, true);
        var navigateContinuation =  this.getNavigateContinuation(oldUrl, state, data, url, historyAction, history);
        var unloadContinuation = () => {
            if (oldUrl === this.state.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.state.stateContext.state)
            this.state.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }

    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none', history: boolean): () => void {
        return (asyncData?: any) => {
            this.setState(({stateContext: prevStateContext}) => {
                if (oldUrl === prevStateContext.url) {
                    var stateContext = this.getStateContext(state, data, url, asyncData, history);
                    return {stateContext};
                }
                return null;    
            }, () => {
                if (this.state.stateContext.oldState && this.state.stateContext.oldState !== state)
                    this.state.stateContext.oldState.dispose();
                state.navigated(this.state.stateContext.data, asyncData);
                if (url === this.state.stateContext.url) {
                    if (historyAction !== 'none')
                        this.props.stateNavigator.historyManager.addHistory(url, historyAction === 'replace');
                    if (this.state.stateContext.title && (typeof document !== 'undefined'))
                        document.title = this.state.stateContext.title;
                }
            });
        };
    }

    render() {
        var { children } = this.props;
        var { oldState, state, data, asyncData } = this.state.stateContext;
        var stateNavigator = this.props.stateNavigator.clone();
        stateNavigator.stateContext = this.state.stateContext;
        stateNavigator.navigateLink = this.navigateLink;
        return (
            <NavigationContext.Provider value={{ oldState, state, data, asyncData, stateNavigator }}>
                {children}
            </NavigationContext.Provider>
        );
    }
}
export default NavigationHandler;
