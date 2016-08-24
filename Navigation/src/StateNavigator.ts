import Crumb = require('./config/Crumb');
import HashHistoryManager = require('./history/HashHistoryManager');
import HistoryManager = require('./history/HistoryManager');
import State = require('./config/State');
import StateInfo = require('./config/StateInfo');
import StateContext = require('./StateContext');
import StateHandler = require('./StateHandler');

class StateNavigator {
    private NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private navigateHandlerId: number = 1;
    private navigateHandlers: { [index: string]: (oldState: State, state: State, data: any, asyncData: any) => void } = {};
    private stateHandler: StateHandler = new StateHandler();
    stateContext: StateContext = new StateContext();
    historyManager: HistoryManager;
    states: { [index: string]: State } = {};
    
    constructor(states?: StateInfo[], historyManager?: HistoryManager) {
        if (states)
            this.configure(states, historyManager);
    }
    
    configure(stateInfos?: StateInfo[], historyManager?: HistoryManager) {
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = historyManager ? historyManager : new HashHistoryManager();
        this.historyManager.init(() => {
            if (this.stateContext.url === this.historyManager.getCurrentUrl())
                return;
            this.navigateLink(this.historyManager.getCurrentUrl(), undefined, true);
        });
        var states = this.stateHandler.buildStates(stateInfos);
        this.states = {};
        for(var i = 0; i < states.length; i++)
            this.states[states[i].key] = states[i];
    }

    private setStateContext(state: State, data: any, url: string) {
        this.stateContext.oldState = this.stateContext.state;
        this.stateContext.oldData = this.stateContext.data;
        this.stateContext.state = state;
        this.stateContext.url = url;
        this.stateContext.title = state.title;
        this.stateContext.data = data;
        this.buildCrumbTrail();
        this.stateContext.previousState = null;
        this.stateContext.previousData = {};
        if (this.stateContext.crumbs.length > 0) {
            var previousStateCrumb = this.stateContext.crumbs.slice(-1)[0];
            this.stateContext.previousState = previousStateCrumb.state;
            this.stateContext.previousData = previousStateCrumb.data;
        }
    }
    
    private buildCrumbTrail() {
        this.stateContext.crumbs = this.stateContext.data[this.stateContext.state.crumbTrailKey];
        delete this.stateContext.data[this.stateContext.state.crumbTrailKey];
        var crumblessUrl = this.getLink(this.stateContext.state, this.stateContext.data, []);
        if (!crumblessUrl)
            throw new Error(this.stateContext.state.crumbTrailKey + ' cannot be a mandatory route parameter')
        this.stateContext.nextCrumb = new Crumb(this.stateContext.data, this.stateContext.state, this.stateContext.url, crumblessUrl, false);
    }
    
    onNavigate(handler: (oldState: State, state: State, data: any, asyncData: any) => void) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        } else {
            throw new Error('Cannot add the same handler more than once');
        }
    }

    offNavigate(handler: (oldState: State, state: State, data: any, asyncData: any) => void) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    }

    navigate(stateKey: string, navigationData?: any, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getNavigationLink(stateKey: string, navigationData?: any): string {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        return this.getLink(this.states[stateKey], navigationData);
    }

    private getLink(state: State, navigationData: any, crumbTrail?: string[]): string {
        if (!crumbTrail) {
            crumbTrail = [];
            var crumbs = this.stateContext.crumbs.slice();
            if (this.stateContext.nextCrumb)
                crumbs.push(this.stateContext.nextCrumb);
            crumbs = state.truncateCrumbTrail(state, crumbs);
            for(var i = 0; i < crumbs.length; i++)
                crumbTrail.push(crumbs[i].crumblessUrl)
        }
        return this.stateHandler.getNavigationLink(state, navigationData, crumbTrail);
    }

    canNavigateBack(distance: number) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    }

    navigateBack(distance: number, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getNavigationBackLink(distance: number): string {
        if (!this.canNavigateBack(distance))
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
        return this.stateContext.crumbs[this.stateContext.crumbs.length - distance].url;
    }

    refresh(navigationData?: any, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getRefreshLink(navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getRefreshLink(navigationData?: any): string {
        return this.getLink(this.stateContext.state, navigationData);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false) {
        var oldUrl = this.stateContext.url;
        var { state, data } = this.stateHandler.parseNavigationLink(url);
        var navigateContinuation =  this.getNavigateContinuation(oldUrl, state, data, url, historyAction);
        var unloadContinuation = () => {
            if (oldUrl === this.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.stateContext.state)
            this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    
    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: 'add' | 'replace' | 'none'): () => void {
        return (asyncData?: any) => {
            if (oldUrl === this.stateContext.url) {
                this.setStateContext(state, data, url);
                if (this.stateContext.oldState && this.stateContext.oldState !== state)
                    this.stateContext.oldState.dispose();
                state.navigated(this.stateContext.data, asyncData);
                for (var id in this.navigateHandlers) {
                    if (url === this.stateContext.url)
                        this.navigateHandlers[id](this.stateContext.oldState, state, this.stateContext.data, asyncData);
                }
                if (url === this.stateContext.url) {
                    if (historyAction !== 'none')
                        this.historyManager.addHistory(url, historyAction === 'replace');
                    if (this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = this.stateContext.title;
                }
            }
        };
    }
    
    parseLink(url: string): { state: State, data: any } {
        try {
            var { state, data } = this.stateHandler.parseNavigationLink(url);
            delete data[state.crumbTrailKey];
            return { state, data };
        } catch(e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    }
    
    start(url?: string) {
        this.navigateLink(url ? url : this.historyManager.getCurrentUrl());
    };
}
export = StateNavigator;
