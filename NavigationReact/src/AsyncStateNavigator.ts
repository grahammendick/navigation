import React from 'react';
import NavigationHandler from './NavigationHandler';
import { StateNavigator, StateContext } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler: any;
    private stateNavigator: StateNavigator;

    constructor(navigationHandler: any, stateNavigator: StateNavigator, stateContext: StateContext) {
        super(stateNavigator, stateNavigator.historyManager);
        this.navigationHandler = navigationHandler;
        this.stateNavigator = stateNavigator;
        this.stateContext = stateContext;
        this.configure = stateNavigator.configure.bind(stateNavigator);
        this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
        this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
        this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
        this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation?: (stateContext: StateContext, resumeNavigation: () => void) => void,
        currentContext = this.stateContext) {
        if (!suspendNavigation)
            suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
        this.stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            suspendNavigation(stateContext, () => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator, stateContext);
                var { oldState, state, data, asyncData, history, crumbs } = asyncNavigator.stateContext;
                const refresh = oldState === state && crumbs.length === this.stateContext.crumbs.length;
                const startTransition = (!history && !refresh && React.startTransition) || ((transition) => transition());
                startTransition(() => {
                    this.navigationHandler.setState({ context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } }, () => {
                        if (stateContext === this.navigationHandler.state.context.stateNavigator.stateContext)
                            resumeNavigation();
                    });
                });
            })
        }, currentContext);
    }
}
export default AsyncStateNavigator;
