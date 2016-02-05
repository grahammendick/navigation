import Crumb = require('./config/Crumb');
import Dialog = require('./config/Dialog');
import NavigationData = require('./NavigationData');
import NavigationSettings = require('./NavigationSettings');
import ReturnDataManager = require('./ReturnDataManager');
import State = require('./config/State');
import StateContext = require('./StateContext');

class CrumbTrailManager {
    private static CRUMB_1_SEP = '4_';
    private static CRUMB_2_SEP = '5_';

    static buildCrumbTrail(stateContext: StateContext, settings: NavigationSettings, dialogs: Dialog[], uncombined: boolean) {
        var crumbs = this.getCrumbs(stateContext, settings, dialogs, false);
        if (uncombined)
            crumbs.push(new Crumb(NavigationData.setDefaults(stateContext.previousData, stateContext.previousState.defaults), stateContext.previousState, this.getHref(stateContext, settings, stateContext.previousState, stateContext.previousData, null), false));        
        crumbs = stateContext.state.stateHandler.truncateCrumbTrail(stateContext.state, crumbs);
        if (settings.combineCrumbTrail)
            crumbs.push(new Crumb(NavigationData.setDefaults(stateContext.data, stateContext.state.defaults), stateContext.state, this.getHref(stateContext, settings, stateContext.state, stateContext.data, null), false));
        crumbs.reverse();
        var trailString: string = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(settings, crumbs[i].state, crumbs[i].data);
        }
        stateContext.crumbTrail = trailString ? trailString : null;
        stateContext.crumbTrailKey = settings.crumbTrailPersister.save(stateContext.crumbTrail, stateContext.state);
    }

    static getCrumbs(stateContext: StateContext, settings: NavigationSettings, dialogs: Dialog[], setLast: boolean, skipLatest?: boolean): Crumb[] {
        var crumbTrailArray: Crumb[] = [];
        var arrayCount = 0;
        var trail = stateContext.crumbTrail;
        var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
        var last = true;
        while (arrayCount < crumbTrailSize) {
            var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
            var state = this.getState(stateKey, dialogs);
            var navigationData: any = {};
            var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
            if (data)
                navigationData = ReturnDataManager.parseReturnData(settings, data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            if (!skipLatest) {
                crumbTrailArray.push(new Crumb(NavigationData.setDefaults(navigationData, state.defaults), state, this.getHref(stateContext, settings, state, navigationData, null), setLast && last));
                last = false;
            }
            skipLatest = false;
            arrayCount++;
        }
        crumbTrailArray.reverse();
        return crumbTrailArray;
    }

    static getState(id: string, dialogs: Dialog[]) {
        if (!id) return null;
        var ids = id.split('-');
        return dialogs[+ids[0]]._states[+ids[1]];
    }

    static getHref(stateContext: StateContext, settings: NavigationSettings, state: State, navigationData: any, returnData: any): string {
        var data = {};
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state)
            data[settings.previousStateIdKey] = stateContext.state.id;
        if (!settings.router.supportsDefaults) {
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
        }
        var arrayData: { [index: string]: string[] } = {};
        for (var key in navigationData) {
            var val = navigationData[key]; 
            if (val != null && val.toString()) {
                var formattedData = ReturnDataManager.formatURLObject(settings, key, val, state);
                val = formattedData.val;
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key]) {
                    data[key] = val;
                    arrayData[key] = formattedData.arrayVal;
                }
            }
        }
        if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state) {
            if (settings.trackAllPreviousData)
                returnData = stateContext.data;
            var returnDataString = ReturnDataManager.formatReturnData(settings, stateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }
        if (stateContext.crumbTrailKey && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = stateContext.crumbTrailKey;
        return state.stateHandler.getNavigationLink(settings.router, state, data, arrayData);
    }

    static getRefreshHref(stateContext: StateContext, settings: NavigationSettings, refreshData: any): string {
        return this.getHref(stateContext, settings, stateContext.state, refreshData, null);
    }
}
export = CrumbTrailManager;
