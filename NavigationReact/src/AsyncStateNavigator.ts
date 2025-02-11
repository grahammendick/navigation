import React, { startTransition } from 'react';
import NavigationHandler from './NavigationHandler';
import { StateNavigator, StateContext } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler: NavigationHandler;
    private stateNavigator: StateNavigator;

    constructor(navigationHandler: NavigationHandler, stateNavigator: StateNavigator, stateContext: StateContext) {
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

    refresh(navigationData?: any, historyAction?: 'add' | 'replace' | 'none') {
        const refreshData = { ...this.stateContext.state.defaults, ...navigationData };
        const refreshKeys = Object.keys(refreshData);
        let equal = refreshKeys.length === Object.keys(this.stateContext.data).length;
        for (let i = 0; i < refreshKeys.length && equal; i++) {
            const key = refreshKeys[i];
            equal = equal && AsyncStateNavigator.areEqual(refreshData[key], this.stateContext.data[key]);
        }
        if (!equal)
            super.refresh(navigationData, historyAction);
        else {
            const { oldState, state, data, asyncData } = this.stateContext;
            startTransition(() => {
                this.navigationHandler.setState({ context: { ignoreCache: true, oldState, state, data, asyncData, stateNavigator: this } });
            });
        }
    }

    private static areEqual(val: any, currentVal: any): boolean {
        if (currentVal == null)
            return val == null || val === '';
        const valType = Object.prototype.toString.call(val);
        if (valType !== Object.prototype.toString.call(currentVal))
            return false;
        if (valType === '[object Array]') {
            let active = val.length === currentVal.length;
            for(let i = 0; active && i < val.length; i++) {
                active = this.areEqual(val[i], currentVal[i]);
            }
            return active;
        } else {
            return isNaN(val) ? val === currentVal : +val === +currentVal;
        }
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation?: (stateContext: StateContext, resumeNavigation: () => void) => void,
        currentContext = this.stateContext) {
        if (!suspendNavigation)
            suspendNavigation = (_stateContext, resumeNavigation) => resumeNavigation();
        this.stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            suspendNavigation(stateContext, () => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator, stateContext);
                var { oldState, state, data, asyncData } = asyncNavigator.stateContext;
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
