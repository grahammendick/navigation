import Crumb = require('./Crumb');
import CrumbTrailManager = require('./CrumbTrailManager');
import HistoryNavigator = require('./history/HistoryNavigator');
import HistoryAction = require('./history/HistoryAction');
import NavigationData = require('./NavigationData');
import ReturnDataManager = require('./ReturnDataManager');
import settings = require('./settings');
import State = require('./config/State');
import StateContext = require('./StateContext');
import StateInfoConfig = require('./config/StateInfoConfig');

class StateController {
    crumbs: Crumb[];
    private NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private navigateHandlerId: number = 1;
    private navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};
    stateContext: StateContext = new StateContext();

    setStateContext(state: State, url: string) {
        try {
            this.setOldStateContext();
            this.stateContext.state = state;
            this.stateContext.url = url;
            this.stateContext.dialog = state.parent;
            this.stateContext.title = state.title;
            var separableData = {};
            var data = state.stateHandler.getNavigationData(state, url, separableData);
            this.stateContext.data = this.parseData(data, state, separableData);
            this.stateContext.previousState = null;
            this.stateContext.previousDialog = null;
            this.stateContext.previousData = {};
            this.stateContext.crumbTrail = settings.crumbTrailPersister.load(data[settings.crumbTrailKey]);
            var uncombined = !!data[settings.previousStateIdKey];
            this.setPreviousStateContext(uncombined, data);
            CrumbTrailManager.buildCrumbTrail(this.stateContext, uncombined);
            this.crumbs = CrumbTrailManager.getCrumbs(this.stateContext, true, settings.combineCrumbTrail);
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
            this.stateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
            if (this.stateContext.previousState)
                this.stateContext.previousDialog = this.stateContext.previousState.parent;
            if (data[settings.returnDataKey])
                this.stateContext.previousData = ReturnDataManager.parseReturnData(data[settings.returnDataKey], this.stateContext.previousState);
        } else {
            var previousStateCrumb = CrumbTrailManager.getCrumbs(this.stateContext, false).pop();
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
        this._navigateLink(url, this.getNextState(action), false, historyAction);
    }

    getNavigationLink(action: string, toData?: any): string {
        return CrumbTrailManager.getHref(this.stateContext, this.getNextState(action), toData, this.stateContext.data);
    }

    canNavigateBack(distance: number) {
        var canNavigate = false;
        if (distance <= this.crumbs.length && distance > 0)
            canNavigate = true;
            return canNavigate
        }

    navigateBack(distance: number, historyAction?: HistoryAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state, false, historyAction);
    }

    getNavigationBackLink(distance: number): string {
        return this.getCrumb(distance).navigationLink;
    }

    refresh(toData?: any, historyAction?: HistoryAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.stateContext.state, false, historyAction);
    }

    getRefreshLink(toData?: any): string {
        return CrumbTrailManager.getRefreshHref(this.stateContext, toData);
    }

    navigateLink(url: string, history?: boolean, historyAction?: HistoryAction) {
        try {
            var state = settings.router.getData(url.split('?')[0]).state;
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state, history, historyAction);
    }

    private _navigateLink(url: string, state: State, history = false, historyAction = HistoryAction.Add) {
        try {
            var oldUrl = this.stateContext.url;
            var separableData = {};
            var data = state.stateHandler.getNavigationData(state, url, separableData);
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
                        settings.historyManager.addHistory(state, url, historyAction === HistoryAction.Replace);
                    if (this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = this.stateContext.title;
                }
            }
        };
    }

    private parseData(data: any, state: State, separableData: any): any {
        var newData = {};
        for (var key in data) {
            if (key !== settings.previousStateIdKey && key !== settings.returnDataKey
                && key !== settings.crumbTrailKey && !this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = ReturnDataManager.parseURLString(key, data[key], state, false, !!separableData[key]);
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
        if (!nextState && StateInfoConfig.dialogs[action])
            nextState = StateInfoConfig.dialogs[action].initial;
        if (!nextState)
            throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
        return nextState;
    }

    private getCrumb(distance: number): Crumb {
        if (distance > this.crumbs.length || distance <= 0)
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.crumbs.length + ')');
        return this.crumbs[this.crumbs.length - distance];
    }
}
export = StateController;
