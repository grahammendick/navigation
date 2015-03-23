import StateContext = require('StateContext');
import Crumb = require('Crumb');
import State = require('config/State');
import CrumbTrailManager = require('CrumbTrailManager');
import settings = require('settings');
import router = require('router');
import NavigationData = require('NavigationData');
import StateInfoConfig = require('config/StateInfoConfig');

class StateController {
    static crumbs: Array<Crumb>;
    private static NAVIGATE_HANDLER_ID = 'navigateHandlerId';
    private static navigateHandlerId: number = 1;
    private static navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};

    static setStateContext(state: State, url: string) {
        var oldState = StateContext.state;
        try {
            StateContext.state = state;
            StateContext.url = url;
            StateContext.dialog = state.parent;
            var data = state.stateHandler.getNavigationData(state, url);
            StateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
            StateContext.previousDialog = null;
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
            CrumbTrailManager.returnData = {};
            if (data[settings.returnDataKey])
                CrumbTrailManager.returnData = CrumbTrailManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
            CrumbTrailManager.crumbTrail = data[settings.crumbTrailKey];
            StateContext.data = this.parseData(data, state);
            CrumbTrailManager.buildCrumbTrail();
            this.crumbs = CrumbTrailManager.getCrumbs(true);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        if (oldState && oldState !== state)
            oldState.dispose();
        state.navigated(StateContext.data);
        for (var id in this.navigateHandlers) {
            if (url === StateContext.url)
                this.navigateHandlers[id](oldState, state, StateContext.data);
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

    static navigate(action: string, toData?: any) {
        var url = this.getNavigationLink(action, toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getNextState(action));
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

    static navigateBack(distance: number) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, this.getCrumb(distance).state);
    }

    static getNavigationBackLink(distance: number): string {
        return this.getCrumb(distance).navigationLink;
    }

    static refresh(toData?: any) {
        var url = this.getRefreshLink(toData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this._navigateLink(url, StateContext.state);
    }

    static getRefreshLink(toData?: any): string {
        return CrumbTrailManager.getRefreshHref(toData);
    }

    static navigateLink(url: string) {
        try {
            var state = router.getData(url.split('?')[0]).state;
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        this._navigateLink(url, state);
    }

    private static _navigateLink(url: string, state: State) {
        try {
            var oldUrl = StateContext.url;
            var oldState = StateContext.state;
            var data = state.stateHandler.getNavigationData(state, url);
            data = this.parseData(data, state);
        } catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
        state.navigating(data, url, () => {
            if (oldUrl === StateContext.url)
                state.stateHandler.navigateLink(oldState, state, url);
        });
    }

    private static parseData(data: any, state: State): any {
        var newData = {};
        for (var key in data) {
            if (key !== settings.previousStateIdKey && key !== settings.returnDataKey && key !== settings.crumbTrailKey)
                newData[key] = CrumbTrailManager.parseURLString(key, data[key], state);
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
