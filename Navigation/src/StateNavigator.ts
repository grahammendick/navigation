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
    private rewriteCache = { rewrites: {} };
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
        }, (url) => this.rewriteCache.rewrites[url]);
        if (this.isStateInfos(stateInfos)) {
            var states = this.stateHandler.buildStates(stateInfos);
            this.states = {};
            for(var i = 0; i < states.length; i++)
                this.states[states[i].key] = states[i];
        } else {
            this.stateHandler = stateInfos.stateHandler;
            this.states = stateInfos.states;
            this.rewriteCache = stateInfos.rewriteCache;
        }
    }

    private isStateInfos(stateInfos: StateInfo[] | StateNavigator): stateInfos is StateInfo[] {
        return !(stateInfos as StateNavigator).stateHandler;
    };

    private createStateContext(state: State, data: any, hash: string, crumbs: Crumb[], url: string, asyncData: any, history: boolean, historyAction: 'add' | 'replace' | 'none', currentContext: StateContext): StateContext {
        var stateContext = new StateContext();
        stateContext.oldState = currentContext.state;
        stateContext.oldData = currentContext.data;
        stateContext.oldHash = currentContext.hash;
        stateContext.oldUrl = currentContext.url;
        stateContext.state = state;
        stateContext.url = url;
        stateContext.asyncData = asyncData;
        stateContext.title = state.title;
        stateContext.history = history;
        stateContext.historyAction = historyAction;
        stateContext.crumbs = crumbs;
        stateContext.data = data;
        stateContext.hash = hash;
        stateContext.nextCrumb = new Crumb(data, state, url, this.stateHandler.getLink(state, data, hash), false, hash);
        if (stateContext.crumbs.length > 0) {
            var previousStateCrumb = stateContext.crumbs.slice(-1)[0];
            stateContext.previousState = previousStateCrumb.state;
            stateContext.previousData = previousStateCrumb.data;
            stateContext.previousHash = previousStateCrumb.hash;
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

    getNavigationLink(stateKey: string, navigationData?: any, hash?: string): string {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        var { crumbs, nextCrumb } = this.stateContext;
        var url = this.stateHandler.getLink(this.states[stateKey], navigationData, hash, crumbs, nextCrumb);
        this.rewrite(url, this.states[stateKey], navigationData, crumbs, nextCrumb);
        return url;
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
        var {url, state, data} = this.stateContext.crumbs[this.stateContext.crumbs.length - distance];
        this.rewrite(url, state, data, this.stateContext.crumbs.slice(0, this.stateContext.crumbs.length - distance));
        return url;
    }

    refresh(navigationData?: any, historyAction?: 'add' | 'replace' | 'none') {
        var url = this.getRefreshLink(navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getRefreshLink(navigationData?: any, hash?: string): string {
        var { crumbs } = this.stateContext;
        var url = this.stateHandler.getLink(this.stateContext.state, navigationData, hash, crumbs);
        this.rewrite(url, this.stateContext.state, navigationData, crumbs);
        return url;
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation: (stateContext: StateContext, resumeNavigation: () => void) => void = (_, resumeNavigation) => resumeNavigation(),
        currentContext = this.stateContext) {
        if (history && this.stateContext.url === url)
            return;
        var context = this.stateContext;
        var { state, data, hash, crumbs } = this.parseLink(url);
        for (var id in this.onBeforeNavigateCache.handlers) {
            var handler = this.onBeforeNavigateCache.handlers[id];
            if (context !== this.stateContext || !handler(state, data, url, history, currentContext))
                return;
        }
        var navigateContinuation = (asyncData?: any) => {
            var nextContext = this.createStateContext(state, data, hash, crumbs, url, asyncData, history, historyAction, currentContext);
            if (context === this.stateContext) {
                suspendNavigation(nextContext, () => {
                    if (context === this.stateContext)
                        this.resumeNavigation(nextContext);
                });
            }
        };
        var unloadContinuation = () => {
            if (context === this.stateContext)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (currentContext.state)
            currentContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    
    private resumeNavigation(stateContext: StateContext) {
        this.stateContext = stateContext;
        var { oldState, state, data, asyncData, url, crumbs, historyAction } = stateContext;
        this.rewriteCache.rewrites = {};
        this.rewrite(url, state, data, crumbs);
        if (this.stateContext.oldState && this.stateContext.oldState !== state)
            this.stateContext.oldState.dispose();
        state.navigated(this.stateContext.data, asyncData);
        for (var id in this.onNavigateCache.handlers) {
            if (stateContext === this.stateContext)
                this.onNavigateCache.handlers[id](oldState, state, data, asyncData, stateContext);
        }
        if (stateContext === this.stateContext) {
            if (historyAction !== 'none')
                this.historyManager.addHistory(url, historyAction === 'replace', this.stateContext);
            if (this.stateContext.title && (typeof document !== 'undefined'))
                document.title = this.stateContext.title;
        }
    }

    private rewrite(url: string, state: State, navigationData: any, crumbs?: Crumb[], nextCrumb?: Crumb) {
        if (url && !this.rewriteCache.rewrites[url]) {
            navigationData = { ...state.defaults, ...navigationData };
            var rewrittenNavigation = state.rewriteNavigation?.(navigationData);
            if (rewrittenNavigation) {
                if (crumbs) {
                    crumbs = crumbs.slice();
                    if (nextCrumb)
                        crumbs.push(nextCrumb);
                    crumbs = state.truncateCrumbTrail(state, navigationData, crumbs);
                }
                crumbs = state.trackCrumbTrail ? crumbs : [];
                var {stateKey, navigationData, hash} = rewrittenNavigation;
                state = this.states[stateKey];
                if (state) {
                    var rewrittenUrl = this.stateHandler.getLink(state, navigationData, hash, crumbs);
                    if (rewrittenUrl) {
                        this.rewriteCache.rewrites[url] = rewrittenUrl;
                    }
                }
            }
        }
    }

    parseLink(url: string): { state: State, data: any, hash: string, crumbs: Crumb[] } {
        var { state, data, hash } = this.stateHandler.parseLink(url);
        var { [state.crumbTrailKey]: crumbs, ...data } = data;
        return { state, data, hash, crumbs };
    }

    fluent(withContext = false): FluentNavigator {
        var stateContext = !withContext ? undefined : this.stateContext;
        return createFluentNavigator(this.states, this.stateHandler, stateContext, this.rewrite.bind(this));
    }

    start(url?: string, serverRendered = false) {
        if (url == null && serverRendered && !this.historyManager.disabled && window.history.state?.navigationLink) {
            delete window.history.state.navigationLink;
            window.history.replaceState(window.history.state, null);
        }
        this.navigateLink(url != null ? url : this.historyManager.getCurrentUrl());
    };
}
export default StateNavigator;
