import ConverterFactory = require('./converter/ConverterFactory');
import Crumb = require('./config/Crumb');
import Dialog = require('./config/Dialog');
import IDialog = require('./config/IDialog');
import HashHistoryManager = require('./history/HashHistoryManager');
import HistoryAction = require('./history/HistoryAction');
import IHistoryManager = require('./history/IHistoryManager');
import NavigationDataManager = require('./NavigationDataManager');
import State = require('./config/State');
import IState = require('./config/IState');
import StateContext = require('./StateContext');
import StateInfoConfig = require('./StateInfoConfig');
import StateRouter = require('./StateRouter');
import ITransition = require('./config/ITransition');

class StateController {
    private NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private navigateHandlerId: number = 1;
    private navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};
    private converterFactory: ConverterFactory = new ConverterFactory();
    private router: StateRouter = new StateRouter();
    stateContext: StateContext = new StateContext();
    historyManager: IHistoryManager;
    dialogs: { [index: string]: Dialog } = {};
    _dialogs: Dialog[] = [];
    
    constructor(dialogs?: IDialog<string, IState<ITransition<string>[]>[]>[], historyManager?: IHistoryManager) {
        if (dialogs)
            this.configure(dialogs, historyManager);
    }
    
    configure(dialogs: IDialog<string, IState<ITransition<string>[]>[]>[], historyManager?: IHistoryManager) {
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = historyManager ? historyManager : new HashHistoryManager();
        this.historyManager.init(() => {
            if (this.stateContext.url === this.historyManager.getCurrentUrl())
                return;
            this.navigateLink(this.historyManager.getCurrentUrl(), undefined, true);
        });
        var config = StateInfoConfig.build(dialogs, this.converterFactory);
        this._dialogs = config._dialogs;
        this.dialogs = config.dialogs;
        this.router.addRoutes(this._dialogs);
    }

    private setStateContext(state: State, data: any, url: string) {
        this.setOldStateContext();
        this.stateContext.state = state;
        this.stateContext.url = url;
        this.stateContext.dialog = state.parent;
        this.stateContext.title = state.title;
        this.stateContext.data = data;
        this.buildCrumbTrail(false);
        this.setPreviousStateContext(false);
    }

    clearStateContext() {
        this.stateContext.oldState = null;
        this.stateContext.oldDialog = null;
        this.stateContext.oldData = {};
        this.stateContext.previousState = null;
        this.stateContext.previousDialog = null;
        this.stateContext.previousData = {};
        this.stateContext.state = null;
        this.stateContext.dialog = null;
        this.stateContext.data = {};
        this.stateContext.url = null;
        this.stateContext.title = null;
        this.stateContext.crumbs = [];
        this.stateContext.crumbTrail = [];
        this.stateContext.nextCrumb = null;
    }
    
    private setOldStateContext() {
        if (this.stateContext.state) {
            this.stateContext.oldState = this.stateContext.state;
            this.stateContext.oldDialog = this.stateContext.dialog;
            this.stateContext.oldData = this.stateContext.data;
        }
    }
    
    private setPreviousStateContext(uncombined: boolean) {
        this.stateContext.previousState = null;
        this.stateContext.previousDialog = null;
        this.stateContext.previousData = {};
        if (this.stateContext.crumbs.length > 0) {
            var previousStateCrumb = this.stateContext.crumbs.slice(-1)[0];
            this.stateContext.previousState = previousStateCrumb.state;
            this.stateContext.previousDialog = this.stateContext.previousState.parent;
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
        var crumblessLink = this.getLink(this.stateContext.state, this.stateContext.data, []);
        if (!crumblessLink)
            throw new Error(this.stateContext.state.crumbTrailKey + ' cannot be a mandatory route parameter')
        this.stateContext.nextCrumb = new Crumb(this.stateContext.data, this.stateContext.state, this.stateContext.url, crumblessLink, false);
    }

    private getCrumbs(): Crumb[] {
        var crumbs: Crumb[] = [];
        var len = this.stateContext.crumbTrail.length;
        for(var i = 0; i < len; i++) {
            var crumblessLink = this.stateContext.crumbTrail[i];
            if (crumblessLink.substring(0, 1) !== '/')
                throw new Error(crumblessLink + ' is not a valid crumb');
            var { state, data } = this.parseLink(crumblessLink);
            var link = this.getLink(state, data, this.stateContext.crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, link, crumblessLink, i + 1 == len));
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

    navigate(action: string, toData?: any, historyAction?: HistoryAction) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getNavigationLink(action: string, toData?: any): string {
        return this.getLink(this.getNextState(action), toData);
    }

    private getLink(state: State, navigationData: any, crumbTrail?: string[]): string {
        if (!crumbTrail) {
            crumbTrail = [];
            var crumbs = this.stateContext.crumbs.slice();
            if (this.stateContext.nextCrumb)
                crumbs.push(this.stateContext.nextCrumb);
            crumbs = state.stateHandler.truncateCrumbTrail(state, crumbs);
            for(var i = 0; i < crumbs.length; i++)
                crumbTrail.push(crumbs[i].crumblessLink)
        }
        var { data, arrayData } = NavigationDataManager.formatData(this.converterFactory, state, navigationData, crumbTrail);
        return state.stateHandler.getNavigationLink(this.router, state, data, arrayData);
    }

    canNavigateBack(distance: number) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    }

    navigateBack(distance: number, historyAction?: HistoryAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getNavigationBackLink(distance: number): string {
        if (!this.canNavigateBack(distance))
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
        return this.stateContext.crumbs[this.stateContext.crumbs.length - distance].navigationLink;
    }

    refresh(toData?: any, historyAction?: HistoryAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    }

    getRefreshLink(toData?: any): string {
        return this.getLink(this.stateContext.state, toData);
    }

    navigateLink(url: string, historyAction = HistoryAction.Add, history = false) {
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
    
    private getNavigateContinuation(oldUrl: string, state: State, data: any, url: string, historyAction: HistoryAction): () => void {
        return (asyncData?: any) => {
            if (oldUrl === this.stateContext.url) {
                state.stateHandler.navigateLink(this.stateContext.state, state, url);
                this.setStateContext(state, data, url);
                if (this.stateContext.oldState && this.stateContext.oldState !== state)
                    this.stateContext.oldState.dispose();
                state.navigated(this.stateContext.data, asyncData);
                for (var id in this.navigateHandlers) {
                    if (url === this.stateContext.url)
                        this.navigateHandlers[id](this.stateContext.oldState, state, this.stateContext.data);
                }
                if (url === this.stateContext.url) {
                    if (historyAction !== HistoryAction.None)
                        this.historyManager.addHistory(url, historyAction === HistoryAction.Replace);
                    if (this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = this.stateContext.title;
                }
            }
        };
    }
    
    parseLink(url: string): { state: State, data: any } {
        try {
            var state = this.router.getData(url.split('?')[0]).state;
            var { data, separableData } = state.stateHandler.getNavigationData(this.router, state, url);
            data = NavigationDataManager.parseData(this.converterFactory, data, state, separableData);
            return { state: state, data: data };
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    }
    
    private isDefault(key: string, data: any, state: State, separable: boolean) {
        var val = data[key]
        var arrayDefaultVal = state.formattedArrayDefaults[key];
        if (!separable || !arrayDefaultVal) {
            return val === state.formattedDefaults[key];
        } else {
            if (typeof val === 'string')
                val = [val];
            if (val.length !== arrayDefaultVal.length) 
                return false;
            for(var i = 0; i < val.length; i++) {
                if (val[i] !== arrayDefaultVal[i])
                    return false;
            }
            return true;
        }
    }

    getNextState(action: string): State {
        var nextState: State = null;
        if (this.stateContext.state && this.stateContext.state.transitions[action])
            nextState = this.stateContext.state.transitions[action].to;
        if (!nextState && this.dialogs[action])
            nextState = this.dialogs[action].initial;
        if (!nextState)
            throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
        return nextState;
    }
    
    start(url?: string) {
        this.navigateLink(url ? url : this.historyManager.getCurrentUrl());
    };
}
export = StateController;
