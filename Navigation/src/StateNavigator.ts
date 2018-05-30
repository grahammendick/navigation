import Crumb from './config/Crumb';
import EventHandlerCache from './EventHandlerCache';
import { FluentNavigator, createFluentNavigator } from './FluentNavigator';
import HashHistoryManager from './history/HashHistoryManager';
import HistoryManager from './history/HistoryManager';
import State from './config/State';
import StateInfo from './config/StateInfo';
import StateContext from './StateContext';
import StateHandler from './StateHandler';
type NavigateHandler = (oldState: State, state: State, data: any, asyncData: any, stateContext: StateContext) => void;
type BeforeNavigateHandler = (state: State, data: any, url: string, history: boolean, currentContext: StateContext) => boolean;

class StateNavigator {
    private stateHandler = new StateHandler();
    private onBeforeNavigateCache = new EventHandlerCache<BeforeNavigateHandler>('beforeNavigateHandler');
    private onNavigateCache = new EventHandlerCache<NavigateHandler>('navigateHandler');
    stateContext = new StateContext();
    historyManager: HistoryManager;
    states: { [index: string]: State } = {};
    onBeforeNavigate = (handler: BeforeNavigateHandler) => this.onBeforeNavigateCache.onEvent(handler);
    offBeforeNavigate = (handler: BeforeNavigateHandler) => this.onBeforeNavigateCache.offEvent(handler);
    onNavigate = (handler: NavigateHandler) => this.onNavigateCache.onEvent(handler);
    offNavigate = (handler: NavigateHandler) => this.onNavigateCache.offEvent(handler);

    constructor(stateInfos?: StateInfo[] | StateNavigator, historyManager?: HistoryManager) {
        if (stateInfos)
            this.configure(stateInfos, historyManager);
    }

    configure(stateInfos: StateInfo[] | StateNavigator, historyManager?: HistoryManager) {
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = historyManager ? historyManager : new HashHistoryManager();
        this.historyManager.init((url = this.historyManager.getCurrentUrl()) => {
            this.navigateLink(url, undefined, true);
        });
        if (this.isStateInfos(stateInfos)) {
            var states = this.stateHandler.buildStates(stateInfos);
            this.states = {};
            for(var i = 0; i < states.length; i++)
                this.states[states[i].key] = states[i];
        } else {
            this.stateHandler = stateInfos.stateHandler;
            this.states = stateInfos.states;
        }
    }

    private isStateInfos(stateInfos: StateInfo[] | StateNavigator): stateInfos is StateInfo[] {
        return !(<StateNavigator> stateInfos).stateHandler;
    };

    private createStateContext(state: State, data: any, crumbs: Crumb[], url: string, asyncData: any, history: boolean): StateContext {
        var stateContext = new StateContext();
        stateContext.oldState = this.stateContext.state;
        stateContext.oldData = this.stateContext.data;
        stateContext.oldUrl = this.stateContext.url;
        stateContext.state = state;
        stateContext.url = url;
        stateContext.asyncData = asyncData;
        stateContext.title = state.title;
        stateContext.history = history;
        stateContext.crumbs = crumbs;
        stateContext.data = data;
        stateContext.nextCrumb = new Crumb(data, state, url, this.stateHandler.getLink(state, data), false);
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

    navigate(stateKey: string, navigationData?: any, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getNavigationLink(stateKey: string, navigationData?: any): string {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        var { crumbs, nextCrumb } = this.stateContext;
        return this.stateHandler.getLink(this.states[stateKey], navigationData, crumbs, nextCrumb);
    }

    canNavigateBack(distance: number) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    }

    navigateBack(distance: number, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getNavigationBackLink(distance);
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
        var { crumbs, nextCrumb } = this.stateContext;
        return this.stateHandler.getLink(this.stateContext.state, navigationData, crumbs, nextCrumb);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation: (stateContext: StateContext, resumeNavigation: () => void) => void = (_, resumeNavigation) => resumeNavigation()) {
        if (history && this.stateContext.url === url)
            return;
        var oldUrl = this.stateContext.url;
        var { state, data, crumbs } = this.parseLink(url);
        for (var id in this.onBeforeNavigateCache.handlers) {
            var handler = this.onBeforeNavigateCache.handlers[id];
            if (oldUrl !== this.stateContext.url || !handler(state, data, url, history, this.stateContext))
                return;
        }
        var navigateContinuation = (asyncData?: any) => {
            var stateContext = this.createStateContext(state, data, crumbs, url, asyncData, history);
            if (oldUrl === this.stateContext.url) {
                suspendNavigation(stateContext, () => {
                    if (oldUrl === this.stateContext.url)
                        this.resumeNavigation(stateContext, historyAction);
                });
            }
        };
        var unloadContinuation = () => {
            if (oldUrl === this.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.stateContext.state)
            this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    
    private resumeNavigation(stateContext: StateContext, historyAction: 'add' | 'replace' | 'none') {
        this.stateContext = stateContext;
        var { oldState, state, data, asyncData, url } = stateContext;
        if (this.stateContext.oldState && this.stateContext.oldState !== state)
            this.stateContext.oldState.dispose();
        state.navigated(this.stateContext.data, asyncData);
        for (var id in this.onNavigateCache.handlers) {
            if (url === this.stateContext.url)
            this.onNavigateCache.handlers[id](oldState, state, data, asyncData, stateContext);
        }
        if (url === this.stateContext.url) {
            if (historyAction !== 'none')
                this.historyManager.addHistory(url, historyAction === 'replace');
            if (this.stateContext.title && (typeof document !== 'undefined'))
                document.title = this.stateContext.title;
        }
    }

    parseLink(url: string): { state: State, data: any, crumbs: Crumb[] } {
        var { state, data } = this.stateHandler.parseLink(url);
        var { [state.crumbTrailKey]: crumbs, ...data } = data;
        return { state, data, crumbs };
    }

    fluent(withContext = false): FluentNavigator {
        var stateContext = !withContext ? undefined : this.stateContext;
        return createFluentNavigator(this.states, this.stateHandler, stateContext);
    }

    start(url?: string) {
        this.navigateLink(url != null ? url : this.historyManager.getCurrentUrl());
    };
}
export default StateNavigator;
