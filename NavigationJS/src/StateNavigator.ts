import ConverterFactory = require('./converter/ConverterFactory');
import Crumb = require('./config/Crumb');
import HashHistoryManager = require('./history/HashHistoryManager');
import HistoryManager = require('./history/HistoryManager');
import NavigationDataManager = require('./NavigationDataManager');
import State = require('./config/State');
import StateInfo = require('./config/StateInfo');
import StateContext = require('./StateContext');
import StateConfig = require('./StateConfig');
import StateHandler = require('./StateHandler');
import StateRouter = require('./StateRouter');

class StateNavigator {
    private NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private navigateHandlerId: number = 1;
    private navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};
    private converterFactory: ConverterFactory = new ConverterFactory();
    private router: StateRouter = new StateRouter();
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
        var states = StateConfig.build(stateInfos, this.converterFactory);
        this.states = {};
        for(var i = 0; i < states.length; i++)
            this.states[states[i].key] = states[i];
        this.router.addRoutes(states);
    }

    private setStateContext(state: State, data: any, url: string) {
        this.stateContext.oldState = this.stateContext.state;
        this.stateContext.oldData = this.stateContext.data;
        this.stateContext.state = state;
        this.stateContext.url = url;
        this.stateContext.title = state.title;
        this.stateContext.data = data;
        this.buildCrumbTrail(false);
        this.stateContext.previousState = null;
        this.stateContext.previousData = {};
        if (this.stateContext.crumbs.length > 0) {
            var previousStateCrumb = this.stateContext.crumbs.slice(-1)[0];
            this.stateContext.previousState = previousStateCrumb.state;
            this.stateContext.previousData = previousStateCrumb.data;
        }
    }
    
    private buildCrumbTrail(uncombined: boolean) {
        this.stateContext.crumbTrail = [];
        var crumbTrail = this.stateContext.data[this.stateContext.state.crumbTrailKey];
        if (crumbTrail)
            this.stateContext.crumbTrail = crumbTrail;
        delete this.stateContext.data[this.stateContext.state.crumbTrailKey];
        this.stateContext.crumbs = this.getCrumbs();
        var crumblessUrl = this.getLink(this.stateContext.state, this.stateContext.data, []);
        if (!crumblessUrl)
            throw new Error(this.stateContext.state.crumbTrailKey + ' cannot be a mandatory route parameter')
        this.stateContext.nextCrumb = new Crumb(this.stateContext.data, this.stateContext.state, this.stateContext.url, crumblessUrl, false);
    }

    private getCrumbs(): Crumb[] {
        var crumbs: Crumb[] = [];
        var len = this.stateContext.crumbTrail.length;
        for(var i = 0; i < len; i++) {
            var crumblessUrl = this.stateContext.crumbTrail[i];
            var { state, data } = this.parseLink(crumblessUrl);
            var url = this.getLink(state, data, this.stateContext.crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 == len));
        }
        return crumbs;
    }
    
    onNavigate(handler: (oldState: State, state: State, data: any) => void) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        } else {
            throw new Error('Cannot add the same handler more than once');
        }
    }

    offNavigate(handler: (oldState: State, state: State, data: any) => void) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    }

    navigate(stateKey: string, navigationData?: any, historyAction?: string) {
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
        var { data, arrayData } = NavigationDataManager.formatData(this.converterFactory, state, navigationData, crumbTrail);
        return StateHandler.getNavigationLink(this.router, state, data, arrayData);
    }

    canNavigateBack(distance: number) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    }

    navigateBack(distance: number, historyAction?: string) {
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

    refresh(navigationData?: any, historyAction?: string) {
        var url = this.getRefreshLink(navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getRefreshLink(navigationData?: any): string {
        return this.getLink(this.stateContext.state, navigationData);
    }

    navigateLink(url: string, historyAction = 'add', history = false) {
        var oldUrl = this.stateContext.url;
        var { state, data } = this.parseLink(url);
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
    
    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: string): () => void {
        return (asyncData?: any) => {
            if (oldUrl === this.stateContext.url) {
                this.setStateContext(state, data, url);
                if (this.stateContext.oldState && this.stateContext.oldState !== state)
                    this.stateContext.oldState.dispose();
                state.navigated(this.stateContext.data, asyncData);
                for (var id in this.navigateHandlers) {
                    if (url === this.stateContext.url)
                        this.navigateHandlers[id](this.stateContext.oldState, state, this.stateContext.data);
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
            var state = this.router.getData(url.split('?')[0]).state;
            var { data, separableData } = StateHandler.getNavigationData(this.router, state, url);
            data = NavigationDataManager.parseData(this.converterFactory, data, state, separableData);
            var crumbTrail: string[] = data[state.crumbTrailKey];
            if (crumbTrail) {
                for(var i = 0; i < crumbTrail.length; i++) {
                    var crumb = crumbTrail[i];
                    if (crumb.substring(0, 1) !== '/')
                        throw new Error(crumb + ' is not a valid crumb');
                }
            }
            return { state: state, data: data };
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    }
    
    start(url?: string) {
        this.navigateLink(url ? url : this.historyManager.getCurrentUrl());
    };
}
export = StateNavigator;
