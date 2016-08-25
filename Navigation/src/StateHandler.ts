import Crumb = require('./config/Crumb');
import NavigationDataManager = require('./NavigationDataManager');
import Route = require('./routing/Route');
import State = require('./config/State');
import StateInfo = require('./config/StateInfo');
import StateRouter = require('./StateRouter');

class StateHandler {
    private navigationDataManager = new NavigationDataManager();
    private router = new StateRouter();

    buildStates(states: StateInfo[]): State[] {
        var builtStates: State[] = [];
        var stateKeys = {};
        for (var i = 0; i < states.length; i++) {
            var stateObject = states[i];
            var state = new State();
            for (var key in stateObject)
                state[key] = stateObject[key];
            if (!state.key)
                throw new Error('State key is mandatory');
            if (state.route == null)
                state.route = state.key;
            if (state.trackCrumbTrail) {
                state.trackCrumbTrail = true;
                state.crumbTrailKey = 'crumb';
                var trackCrumbTrail = stateObject.trackCrumbTrail;
                if (typeof trackCrumbTrail === 'string')
                    state.crumbTrailKey = trackCrumbTrail;
                state.defaultTypes[state.crumbTrailKey] = 'stringarray';
            }
            for (var key in state.defaults) {
                if (!state.defaultTypes[key])
                    state.defaultTypes[key] = this.navigationDataManager.getConverter(state.defaults[key]).name;
                var formattedData = this.navigationDataManager.formatURLObject(key, state.defaults[key], state); 
                state.formattedDefaults[key] = formattedData.val;
                if (formattedData.arrayVal)
                    state.formattedArrayDefaults[key] = formattedData.arrayVal;
            }
            if (stateKeys[state.key])
                throw new Error('A State with key ' + state.key + ' already exists');
            stateKeys[state.key] = true;
            builtStates.push(state);
        }
        this.router.addRoutes(builtStates);
        return builtStates;
    }

    getNavigationLink(state: State, navigationData: any, crumbTrail: string[]): string {
        var { data, arrayData } = this.navigationDataManager.formatData(state, navigationData, crumbTrail);
        var routeInfo = this.router.getRoute(state, data, arrayData);
        if (routeInfo.route == null)
            return null;
        var query: string[] = [];
        for (var key in data) {
            if (!routeInfo.data[key]) {
                var arr = arrayData[key];
                var encodedKey = state.urlEncode(state, null, key, true);
                if (!arr) {
                    query.push(encodedKey + '=' + state.urlEncode(state, key, data[key], true));
                } else {
                    for(var i = 0; i < arr.length; i++)
                        query.push(encodedKey + '=' + state.urlEncode(state, key, arr[i], true));
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    }

    parseNavigationLink(url: string, fromRoute?: Route, err = ''): { state: State, data: any } {
        var queryIndex = url.indexOf('?');
        var path = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var query = queryIndex >= 0 ? url.substring(queryIndex + 1) : null;
        var match = this.router.getData(path, fromRoute);
        if (!match)
            throw new Error('The Url ' + url + ' is invalid' + (err || '\nNo match found'));
        var { state, data, separableData, route } = match;
        try{
            var navigationData = this.getNavigationData(query, state, data || {}, separableData);
        } catch(e) {
            err += '\n' + e.message;
        }
        return navigationData || this.parseNavigationLink(url, route, err);        
    }

    private getNavigationData(query: string, state: State, data: any, separableData: any): { state: State, data: any } {
        if (query) {
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                var key = state.urlDecode(state, null, param[0], true);
                var val = state.urlDecode(state, key, param[1], true);
                separableData[key] = true;
                var arr = data[key];
                if (!arr) {
                    data[key] = val;
                } else {
                    if (typeof arr === 'string')
                        data[key] = arr = [arr];
                    arr.push(val);
                }
            }
        }
        data = this.navigationDataManager.parseData(data, state, separableData);
        var crumbTrail = data[state.crumbTrailKey];
        delete data[state.crumbTrailKey];
        var valid = state.validate(data);
        if (valid) {
            data[state.crumbTrailKey] = this.getCrumbs(crumbTrail)
            return { state: state, data: data };
        }
        return null;
    }

    private getCrumbs(crumbTrail: string[]): Crumb[] {
        var crumbs: Crumb[] = [];
        var len = crumbTrail ? crumbTrail.length : 0;
        for(var i = 0; i < len; i++) {
            var crumblessUrl = crumbTrail[i];
            if (!crumblessUrl || crumblessUrl.substring(0, 1) !== '/')
                throw new Error(crumblessUrl + ' is not a valid crumb');
            var { state, data } = this.parseNavigationLink(crumblessUrl);
            delete data[state.crumbTrailKey];
            var url = this.getNavigationLink(state, data, crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len));
        }
        return crumbs;
    }
}
export = StateHandler;
