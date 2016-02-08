import ConverterFactory = require('./converter/ConverterFactory');
import Crumb = require('./config/Crumb');
import CrumbTrailManager = require('./CrumbTrailManager');
import Dialog = require('./config/Dialog');
import IDialog = require('./config/IDialog');
import HistoryAction = require('./history/HistoryAction');
import IHistoryManager = require('./history/IHistoryManager');
import NavigationData = require('./NavigationData');
import NavigationSettings = require('./NavigationSettings');
import INavigationSettings = require('./INavigationSettings');
import ReturnDataManager = require('./ReturnDataManager');
import State = require('./config/State');
import IState = require('./config/IState');
import StateContext = require('./StateContext');
import StateInfoConfig = require('./StateInfoConfig');
import Transition = require('./config/Transition');
import ITransition = require('./config/ITransition');

class StateController {
    private NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private navigateHandlerId: number = 1;
    private navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};
    private settings: NavigationSettings = new NavigationSettings(); 
    private converterFactory: ConverterFactory = new ConverterFactory();
    stateContext: StateContext = new StateContext();
    historyManager: IHistoryManager;
    dialogs: { [index: string]: Dialog } = {};
    _dialogs: Dialog[] = [];
    
    constructor(dialogs?: IDialog<string, IState<ITransition<string>[]>[]>[], settings?: INavigationSettings) {
        if (dialogs)
            this.configure(dialogs, settings);
    }
    
    configure(dialogs: IDialog<string, IState<ITransition<string>[]>[]>[], settings?: INavigationSettings) {
        for(var setting in settings)
            this.settings[setting] = settings[setting];
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = this.settings.historyManager;
        this.historyManager.init(() => {
            if (this.stateContext.url === this.historyManager.getCurrentUrl())
                return;
            this.navigateLink(this.historyManager.getCurrentUrl(), undefined, true);
        }, this.settings.applicationPath);
        var config = StateInfoConfig.build(dialogs, this.settings, this.converterFactory);
        this._dialogs = config._dialogs;
        this.dialogs = config.dialogs;
        this.settings.router.addRoutes(this._dialogs);
    }

    setStateContext(state: State, url: string) {
        try {
            this.setOldStateContext();
            this.stateContext.state = state;
            this.stateContext.url = url;
            this.stateContext.dialog = state.parent;
            this.stateContext.title = state.title;
            var { data, separableData } = state.stateHandler.getNavigationData(this.settings.router, state, url);
            this.stateContext.data = this.parseData(data, state, separableData);
            this.stateContext.previousState = null;
            this.stateContext.previousDialog = null;
            this.stateContext.previousData = {};
            this.stateContext.crumbTrail = this.settings.crumbTrailPersister.load(data[this.settings.crumbTrailKey]);
            var uncombined = !!data[this.settings.previousStateIdKey];
            this.setPreviousStateContext(uncombined, data);
            CrumbTrailManager.buildCrumbTrail(this.stateContext, this.settings, this.converterFactory, this._dialogs, uncombined);
            this.stateContext.crumbs = CrumbTrailManager.getCrumbs(this.stateContext, this.settings, this.converterFactory, this._dialogs, true, this.settings.combineCrumbTrail);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
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
        this.stateContext.crumbTrail = null;
        this.stateContext.crumbTrailKey = null;
    }
    
    private setOldStateContext() {
        if (this.stateContext.state) {
            this.stateContext.oldState = this.stateContext.state;
            this.stateContext.oldDialog = this.stateContext.dialog;
            this.stateContext.oldData = NavigationData.clone(this.stateContext.data);
            NavigationData.setDefaults(this.stateContext.oldData, this.stateContext.oldState.defaults);
        }
    }
    
    private setPreviousStateContext(uncombined: boolean, data: any) {
        if (uncombined){
            this.stateContext.previousState = CrumbTrailManager.getState(data[this.settings.previousStateIdKey], this._dialogs);
            if (this.stateContext.previousState)
                this.stateContext.previousDialog = this.stateContext.previousState.parent;
            if (data[this.settings.returnDataKey])
                this.stateContext.previousData = ReturnDataManager.parseReturnData(this.settings, this.converterFactory, data[this.settings.returnDataKey], this.stateContext.previousState);
        } else {
            var previousStateCrumb = CrumbTrailManager.getCrumbs(this.stateContext, this.settings, this.converterFactory, this._dialogs, false).pop();
            if (previousStateCrumb){
                this.stateContext.previousState = previousStateCrumb.state;
                this.stateContext.previousDialog = this.stateContext.previousState.parent;
                this.stateContext.previousData = previousStateCrumb.data;
            }
        }
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
        this._navigateLink(url, this.getNextState(action), historyAction);
    }

    getNavigationLink(action: string, toData?: any): string {
        return CrumbTrailManager.getHref(this.stateContext, this.settings, this.converterFactory, this.getNextState(action), toData, this.stateContext.data);
    }

    canNavigateBack(distance: number) {
        var canNavigate = false;
        if (distance <= this.stateContext.crumbs.length && distance > 0)
            canNavigate = true;
            return canNavigate
        }

    navigateBack(distance: number, historyAction?: HistoryAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state, historyAction);
    }

    getNavigationBackLink(distance: number): string {
        return this.getCrumb(distance).navigationLink;
    }

    refresh(toData?: any, historyAction?: HistoryAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.stateContext.state, historyAction);
    }

    getRefreshLink(toData?: any): string {
        return CrumbTrailManager.getRefreshHref(this.stateContext, this.settings, this.converterFactory, toData);
    }

    navigateLink(url: string, historyAction?: HistoryAction, history?: boolean) {
        try {
            var state = this.settings.router.getData(url.split('?')[0]).state;
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state, historyAction, history);
    }

    private _navigateLink(url: string, state: State, historyAction = HistoryAction.Add, history = false) {
        try {
            var oldUrl = this.stateContext.url;
            var { data, separableData } = state.stateHandler.getNavigationData(this.settings.router, state, url);
            data = this.parseData(data, state, separableData);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        var navigateContinuation =  this.getNavigateContinuation(oldUrl, state, url, historyAction);
        var unloadContinuation = () => {
            if (oldUrl === this.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.stateContext.state)
            this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    
    private getNavigateContinuation(oldUrl: string, state: State, url: string, historyAction: HistoryAction): () => void {
        return (asyncData?: any) => {
            if (oldUrl === this.stateContext.url) {
                state.stateHandler.navigateLink(this.stateContext.state, state, url);
                this.setStateContext(state, url);
                if (this.stateContext.oldState && this.stateContext.oldState !== state)
                    this.stateContext.oldState.dispose();
                state.navigated(this.stateContext.data, asyncData);
                for (var id in this.navigateHandlers) {
                    if (url === this.stateContext.url)
                        this.navigateHandlers[id](this.stateContext.oldState, state, this.stateContext.data);
                }
                if (url === this.stateContext.url) {
                    if (historyAction !== HistoryAction.None)
                        this.settings.historyManager.addHistory(url, historyAction === HistoryAction.Replace);
                    if (this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = this.stateContext.title;
                }
            }
        };
    }

    private parseData(data: any, state: State, separableData: any): any {
        var newData = {};
        for (var key in data) {
            if (key !== this.settings.previousStateIdKey && key !== this.settings.returnDataKey
                && key !== this.settings.crumbTrailKey && !this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = ReturnDataManager.parseURLString(this.settings, this.converterFactory, key, data[key], state, false, !!separableData[key]);
        }
        NavigationData.setDefaults(newData, state.defaults);
        return newData;
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

    private getCrumb(distance: number): Crumb {
        if (distance > this.stateContext.crumbs.length || distance <= 0)
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
        return this.stateContext.crumbs[this.stateContext.crumbs.length - distance];
    }
    
    start(url?: string) {
        this.navigateLink(url ? url : this.settings.historyManager.getCurrentUrl());
    };
}
export = StateController;
