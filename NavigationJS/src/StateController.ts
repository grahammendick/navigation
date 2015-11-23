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
    static crumbs: Crumb[];
    private static NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private static navigateHandlerId: number = 1;
    private static navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};

    static setStateContext(state: State, url: string) {
        try {
            this.setOldStateContext();
            StateContext.state = state;
            StateContext.url = url;
            StateContext.dialog = state.parent;
            var data = state.stateHandler.getNavigationData(state, url);
            StateContext.data = this.parseData(data, state);
            StateContext.previousState = null;
            StateContext.previousDialog = null;
            StateContext.previousData = {};
            CrumbTrailManager.crumbTrail = settings.crumbTrailPersister.load(data[settings.crumbTrailKey]);
            var uncombined = !!data[settings.previousStateIdKey];
            this.setPreviousStateContext(uncombined, data);
            CrumbTrailManager.buildCrumbTrail(uncombined);
            this.crumbs = CrumbTrailManager.getCrumbs(true, settings.combineCrumbTrail);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    }

    static clearStateContext() {
        StateContext.oldState = null;
        StateContext.oldDialog = null;
        StateContext.oldData = {};
        StateContext.previousState = null;
        StateContext.previousDialog = null;
        StateContext.previousData = {};
        StateContext.state = null;
        StateContext.dialog = null;
        StateContext.data = {};
        StateContext.url = null;
        CrumbTrailManager.crumbTrail = null;
        CrumbTrailManager.crumbTrailKey = null;
    }
    
    private static setOldStateContext() {
        if (StateContext.state) {
            StateContext.oldState = StateContext.state;
            StateContext.oldDialog = StateContext.dialog;
            StateContext.oldData = NavigationData.clone(StateContext.data);
            NavigationData.setDefaults(StateContext.oldData, StateContext.oldState.defaults);
        }
    }
    
    private static setPreviousStateContext(uncombined: boolean, data: any) {
        if (uncombined){
            StateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
            if (data[settings.returnDataKey])
                StateContext.previousData = ReturnDataManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
        } else {
            var previousStateCrumb = CrumbTrailManager.getCrumbs(false).pop();
            if (previousStateCrumb){
                StateContext.previousState = previousStateCrumb.state;
                StateContext.previousDialog = StateContext.previousState.parent;
                StateContext.previousData = previousStateCrumb.data;
            }
        }
    }

    static onNavigate(handler: (oldState: State, state: State, data: any) => void) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        }
    }

    static offNavigate(handler: (oldState: State, state: State, data: any) => void) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    }

    static navigate(action: string, toData?: any, historyAction?: HistoryAction) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getNextState(action), false, historyAction);
    }

    static getNavigationLink(action: string, toData?: any): string {
        return CrumbTrailManager.getHref(this.getNextState(action), toData, StateContext.data);
    }

    static canNavigateBack(distance: number) {
        var canNavigate = false;
        if (distance <= this.crumbs.length && distance > 0)
            canNavigate = true;
            return canNavigate
        }

    static navigateBack(distance: number, historyAction?: HistoryAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state, false, historyAction);
    }

    static getNavigationBackLink(distance: number): string {
        return this.getCrumb(distance).navigationLink;
    }

    static refresh(toData?: any, historyAction?: HistoryAction) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, StateContext.state, false, historyAction);
    }

    static getRefreshLink(toData?: any): string {
        return CrumbTrailManager.getRefreshHref(toData);
    }

    static navigateLink(url: string, history?: boolean, historyAction?: HistoryAction) {
        try {
            var state = settings.router.getData(url.split('?')[0]).state;
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state, history, historyAction);
    }

    private static _navigateLink(url: string, state: State, history = false, historyAction = HistoryAction.Add) {
        try {
            var oldUrl = StateContext.url;
            var oldState = StateContext.state;
            var data = state.stateHandler.getNavigationData(state, url);
            data = this.parseData(data, state);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        var navigateContinuation =  this.getNavigateContinuation(oldState, oldUrl, state, url, historyAction);
        var unloadContinuation = () => {
            if (oldUrl === StateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (oldState)
            oldState.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    }
    
    private static getNavigateContinuation(oldState: State, oldUrl: string, state: State, url: string, historyAction: HistoryAction): () => void {
        return (asyncData?: any) => {
            if (oldUrl === StateContext.url) {
                state.stateHandler.navigateLink(oldState, state, url);
                StateController.setStateContext(state, url);
                if (oldState && oldState !== state)
                    oldState.dispose();
                state.navigated(StateContext.data, asyncData);
                for (var id in this.navigateHandlers) {
                    if (url === StateContext.url)
                        this.navigateHandlers[id](oldState, state, StateContext.data);
                }
                if (url === StateContext.url && historyAction !== HistoryAction.None)
                    settings.historyManager.addHistory(state, url, historyAction === HistoryAction.Replace);
            }
        };
    }

    private static parseData(data: any, state: State): any {
        var newData = {};
        for (var key in data) {
            if (key !== settings.previousStateIdKey && key !== settings.returnDataKey && key !== settings.crumbTrailKey)
                newData[key] = ReturnDataManager.parseURLString(key, data[key], state);
        }
        NavigationData.setDefaults(newData, state.defaults);
        return newData;
    }

    static getNextState(action: string): State {
        var nextState: State = null;
        if (StateContext.state && StateContext.state.transitions[action])
            nextState = StateContext.state.transitions[action].to;
        if (!nextState && StateInfoConfig.dialogs[action])
            nextState = StateInfoConfig.dialogs[action].initial;
        if (!nextState)
            throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
        return nextState;
    }

    private static getCrumb(distance: number): Crumb {
        if (distance > this.crumbs.length || distance <= 0)
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.crumbs.length + ')');
        return this.crumbs[this.crumbs.length - distance];
    }
}
export = StateController;
