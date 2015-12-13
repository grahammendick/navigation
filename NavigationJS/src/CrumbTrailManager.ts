import Crumb = require('./Crumb');
import NavigationData = require('./NavigationData');
import ReturnDataManager = require('./ReturnDataManager');
import settings = require('./settings');
import State = require('./config/State');
import StateContext = require('./StateContext');
import StateInfoConfig = require('./config/StateInfoConfig');

class CrumbTrailManager {
    static crumbTrail: string = null;
    static crumbTrailKey: string = null;
    private static CRUMB_1_SEP = '4_';
    private static CRUMB_2_SEP = '5_';

    static buildCrumbTrail(uncombined: boolean) {
        var crumbs = this.getCrumbs(false);
        if (uncombined)
            crumbs.push(new Crumb(StateContext.previousData, StateContext.previousState, this.getHref(StateContext.previousState, StateContext.previousData, null), false));        
        crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
        if (settings.combineCrumbTrail)
            crumbs.push(new Crumb(StateContext.data, StateContext.state, this.getHref(StateContext.state, StateContext.data, null), false));
        crumbs.reverse();
        var trailString: string = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(crumbs[i].state, crumbs[i].data);
        }
        this.crumbTrail = trailString ? trailString : null;
        this.crumbTrailKey = settings.crumbTrailPersister.save(this.crumbTrail);
    }

    static getCrumbs(setLast: boolean, skipLatest?: boolean): Crumb[] {
        var crumbTrailArray: Crumb[] = [];
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
            if (!skipLatest) {
                crumbTrailArray.push(new Crumb(navigationData, state, this.getHref(state, navigationData, null), setLast && last));
                last = false;
            }
            skipLatest = false;
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
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && StateContext.state)
            data[settings.previousStateIdKey] = StateContext.state.id;
        if (!settings.router.supportsDefaults) {
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
        }
        var queryStringData: { [index: string]: string[] } = {};
        for (var key in navigationData) {
            var val = navigationData[key]; 
            if (val != null && val.toString()) {
                var formattedData = ReturnDataManager.formatURLObject(key, val, state);
                val = formattedData.val;
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key]) {
                    data[key] = val;
                    queryStringData[key] = formattedData.queryStringVal;
                }
            }
        }
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && StateContext.state) {
            if (settings.trackAllPreviousData)
                returnData = StateContext.data;
            var returnDataString = ReturnDataManager.formatReturnData(StateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (this.crumbTrailKey && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = this.crumbTrailKey;
        return state.stateHandler.getNavigationLink(state, data, queryStringData);
    }

    static getRefreshHref(refreshData: any): string {
        return this.getHref(StateContext.state, refreshData, null);
    }
}
export = CrumbTrailManager;
