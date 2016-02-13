import ConverterFactory = require('./converter/ConverterFactory');
import Crumb = require('./config/Crumb');
import Dialog = require('./config/Dialog');
import NavigationData = require('./NavigationData');
import NavigationSettings = require('./NavigationSettings');
import ReturnDataManager = require('./ReturnDataManager');
import State = require('./config/State');
import StateContext = require('./StateContext');

class CrumbTrailManager {
    //private static CRUMB_1_SEP = '4_';
    //private static CRUMB_2_SEP = '5_';

    static buildCrumbTrail(stateContext: StateContext, settings: NavigationSettings, converterFactory: ConverterFactory, dialogs: Dialog[], uncombined: boolean) {
        var crumbs = this.getCrumbs(stateContext, settings, converterFactory, dialogs, false);
        crumbs = stateContext.state.stateHandler.truncateCrumbTrail(stateContext.state, crumbs);
        stateContext.crumbTrail = [];
        for(var i = 0; i < crumbs.length; i++)
            stateContext.crumbTrail.push(this.removeCrumbs(crumbs[i].navigationLink));
        stateContext.crumbTrail.push(this.removeCrumbs(stateContext.url));
        /*var crumbs = this.getCrumbs(stateContext, settings, converterFactory, dialogs, false);
        if (uncombined)
            crumbs.push(this.getCrumb(stateContext, settings, converterFactory, stateContext.previousState, stateContext.previousData, false));        
        crumbs = stateContext.state.stateHandler.truncateCrumbTrail(stateContext.state, crumbs);
        if (settings.combineCrumbTrail)
            crumbs.push(this.getCrumb(stateContext, settings, converterFactory, stateContext.state, stateContext.data, false));
        crumbs.reverse();
        var trailString: string = '';
        for (var i = 0; i < crumbs.length; i++) {
            trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
            trailString += ReturnDataManager.formatReturnData(settings, converterFactory, crumbs[i].state, crumbs[i].data);
        }
        stateContext.crumbTrail = trailString ? trailString : null;
        stateContext.crumbTrailKey = settings.crumbTrailPersister.save(stateContext.crumbTrail, stateContext.state);*/
    }

    static getCrumbs(stateContext: StateContext, settings: NavigationSettings, converterFactory: ConverterFactory, dialogs: Dialog[], setLast: boolean, skipLatest?: boolean): Crumb[] {
        var crumbTrailArray: Crumb[] = [];
        var len = stateContext.crumbTrail.length - (skipLatest ? 1 : 0);
        for(var i = 0; i < len; i++) {
            var link = stateContext.crumbTrail[i];
            var state = settings.router.getData(link.split('?')[0]).state;
            var { data, separableData } = state.stateHandler.getNavigationData(settings.router, state, link);
            data = this.parseData(settings, converterFactory, data, state, separableData);
            link = this.appendCrumbs(link, stateContext.crumbTrail.slice(0, i));
            crumbTrailArray.push(new Crumb(data, state, link, i === len - 1));            
        }
        //console.log(crumbTrailArray);
        /*var arrayCount = 0;
        var trail = stateContext.crumbTrail;
        var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
        var last = true;
        while (arrayCount < crumbTrailSize) {
            var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
            var state = this.getState(stateKey, dialogs);
            var navigationData: any = {};
            var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
            if (data)
                navigationData = ReturnDataManager.parseReturnData(settings, converterFactory, data, state);
            var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
            trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
            if (!skipLatest) {
                crumbTrailArray.push(this.getCrumb(stateContext, settings, converterFactory, state, navigationData, setLast && last));
                last = false;
            }
            skipLatest = false;
            arrayCount++;
        }
        crumbTrailArray.reverse();*/
        return crumbTrailArray;
    }

    static parseData(settings, converterFactory, data: any, state: State, separableData: any): any {
        var newData = {};
        for (var key in data) {
            if (!this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = ReturnDataManager.parseURLString(settings, converterFactory, key, data[key], state, false, !!separableData[key]);
        }
        NavigationData.setDefaults(newData, state.defaults);
        return newData;
    }
    
    static isDefault(key: string, data: any, state: State, separable: boolean) {
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
    
    static getCrumb(stateContext: StateContext, settings: NavigationSettings, converterFactory: ConverterFactory, state: State, data: any, last: boolean): Crumb {
        var link = this.getHref(stateContext, settings, converterFactory, state, data, null);
        return new Crumb(NavigationData.setDefaults(data, state.defaults), state, link, last);        
    }

    /*static getState(id: string, dialogs: Dialog[]) {
        if (!id) return null;
        var ids = id.split('-');
        return dialogs[+ids[0]]._states[+ids[1]];
    }*/

    static getHref(stateContext: StateContext, settings: NavigationSettings, converterFactory: ConverterFactory, state: State, navigationData: any, returnData: any): string {
        var data = {};
        /*if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state)
            data[settings.previousStateIdKey] = stateContext.state.id;*/
        if (!settings.router.supportsDefaults) {
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
        }
        var arrayData: { [index: string]: string[] } = {};
        for (var key in navigationData) {
            var val = navigationData[key]; 
            if (val != null && val.toString()) {
                var formattedData = ReturnDataManager.formatURLObject(settings, converterFactory, key, val, state);
                val = formattedData.val;
                if (!settings.router.supportsDefaults || val !== state.formattedDefaults[key]) {
                    data[key] = val;
                    arrayData[key] = formattedData.arrayVal;
                }
            }
        }
        /*if (!settings.combineCrumbTrail && state.trackCrumbTrail && stateContext.state) {
            if (settings.trackAllPreviousData)
                returnData = stateContext.data;
            var returnDataString = ReturnDataManager.formatReturnData(settings, converterFactory, stateContext.state, returnData);
            if (returnDataString)
                data[settings.returnDataKey] = returnDataString;
        }*
        if (stateContext.crumbTrailKey && state.trackCrumbTrail)
            data[settings.crumbTrailKey] = stateContext.crumbTrailKey;*/
        var link = state.stateHandler.getNavigationLink(settings.router, state, data, arrayData);
        if (state.trackCrumbTrail)
            link = this.appendCrumbs(link, stateContext.crumbTrail);
        return link;
    }
    
    //Do all the clearing and appending crumbs by just building navigation links
    //No parsing urls!! Means crumb handling is automatic
    private static removeCrumbs(link: string): string {
        if (link) {
            var ind = link.indexOf('crumb=');
            if (ind >= 0)
                link = link.substring(0, ind - 1);
        }
        return link;
    }
    
    private static appendCrumbs(link: string, crumbs: string[]): string {
        if (link) {
            var sep = link.indexOf('?') >= 0 ? '&' : '?';
            for(var i = 0; i < crumbs.length; i++) {
                link += sep + 'crumb=' + encodeURIComponent(crumbs[i]);
                sep = '&';
            }
        }
        return link;
    }

    static getRefreshHref(stateContext: StateContext, settings: NavigationSettings, converterFactory: ConverterFactory, refreshData: any): string {
        return this.getHref(stateContext, settings, converterFactory, stateContext.state, refreshData, null);
    }
}
export = CrumbTrailManager;
