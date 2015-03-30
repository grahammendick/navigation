import Crumb = require('./Crumb');
import NavigationData = require('./NavigationData');
import ReturnDataManager = require('./ReturnDataManager');
import router = require('./router');
import settings = require('./settings');
import State = require('./config/State');
import StateContext = require('./StateContext');
import StateInfoConfig = require('./config/StateInfoConfig');

class CrumbTrailManager {
    static returnData: any;
    static crumbTrail: string;
    private static CRUMB_1_SEP = '4_';
    private static CRUMB_2_SEP = '5_';

    static buildCrumbTrail() {
        var crumbs = this.getCrumbs(false);
        if (StateContext.previousState)
            crumbs.push(new Crumb(this.returnData, StateContext.previousState, this.getHref(StateContext.previousState, this.returnData, null), false));
        crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
        crumbs.reverse();
        var trailString: string = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(crumbs[i].state, crumbs[i].data);
        }
        this.crumbTrail = trailString ? trailString : null;
    }

    static getCrumbs(setLast: boolean): Array<Crumb> {
        var crumbTrailArray: Array<Crumb> = [];
        var arrayCount = 0;
        var trail = this.crumbTrail;
        var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
        var last = true;
        while (arrayCount < crumbTrailSize) {
            var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
            var state = this.getState(stateKey);
            var navigationData: any = {};
            var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
            if (data)
                navigationData = ReturnDataManager.parseReturnData(data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            crumbTrailArray.push(new Crumb(navigationData, state, this.getHref(state, navigationData, null), setLast && last));
            last = false;
            arrayCount++;
        }
        crumbTrailArray.reverse();
        return crumbTrailArray;
    }

    static getState(id: string) {
        if (!id) return null;
        var ids = id.split('-');
        return StateInfoConfig._dialogs[+ids[0]]._states[+ids[1]];
    }

    static getHref(state: State, navigationData: any, returnData: any): string {
        var data = {};
        data[settings.stateIdKey] = state.id;
        if (state.trackCrumbTrail && StateContext.state)
            data[settings.previousStateIdKey] = StateContext.state.id;
        navigationData = NavigationData.clone(navigationData);
        NavigationData.setDefaults(navigationData, state.defaults);
        for (var key in navigationData) {
            if (navigationData[key] != null && navigationData[key].toString()
                && (!router.supportsDefaults || navigationData[key] !== state.defaults[key]))
                data[key] = ReturnDataManager.formatURLObject(key, navigationData[key], state);
        }
        if (state.trackCrumbTrail && StateContext.state) {
            var returnDataString = ReturnDataManager.formatReturnData(StateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (this.crumbTrail && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = this.crumbTrail;
        return state.stateHandler.getNavigationLink(state, data);
    }

    static getRefreshHref(refreshData: any): string {
        return this.getHref(StateContext.state, refreshData, null);
    }
}
export = CrumbTrailManager;
