import Crumb from './config/Crumb';
import NavigationDataManager from './NavigationDataManager';
import Route from './routing/Route';
import State from './config/State';
import StateInfo from './config/StateInfo';
import StateRouter from './StateRouter';

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

    getLink(state: State, navigationData: any, crumbs?: Crumb[], nextCrumb?: Crumb): string {
        var crumbTrail = [];
        if (crumbs) {
            crumbs = crumbs.slice();
            if (nextCrumb)
                crumbs.push(nextCrumb);
            crumbs = state.truncateCrumbTrail(state, { ...state.defaults, ...navigationData }, crumbs);
            for(var i = 0; i < crumbs.length; i++)
                crumbTrail.push(crumbs[i].crumblessUrl)
        }
        return this.getNavigationLink(state, navigationData, crumbTrail);
    }

    private getNavigationLink(state: State, navigationData: any, crumbTrail: string[]): string {
        var { data, arrayData } = this.navigationDataManager.formatData(state, navigationData, crumbTrail);
        var routeInfo = this.router.getRoute(state, data, arrayData);
        if (routeInfo.route == null)
            return null;
        var query: string[] = [];
        for (var key in data) {
            if (!routeInfo.data[key]) {
                var arr = arrayData[key];
                if (!arr) {
                    var encodedKey = state.urlEncode(state, null, key, true);
                    var encodedValue = state.urlEncode(state, key, data[key], true);
                    query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                } else {
                    for(var i = 0; i < arr.length; i++) {
                        var encodedKey = state.urlEncode(state, null, key, true, i);
                        var encodedValue = state.urlEncode(state, key, arr[i], true);
                        query.push(encodedKey + (encodedValue ? '=' + encodedValue : ''));
                    }
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    }

    parseLink(url: string, fromRoute?: Route, err = ''): { state: State, data: any } {
        var queryIndex = url.indexOf('?');
        var path = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var query = queryIndex >= 0 ? url.substring(queryIndex + 1) : null;
        var match = this.router.getData(path, fromRoute);
        if (!match)
            throw new Error('The Url ' + url + ' is invalid' + (err || '\nNo match found'));
        var { state, data, separableData, route } = match;
        try {
            var navigationData = this.getNavigationData(query, state, data || {}, separableData);
        } catch(e) {
            err += '\n' + e.message;
        }
        return navigationData || this.parseLink(url, route, err);        
    }

    private getNavigationData(query: string, state: State, data: any, separableData: any): { state: State, data: any } {
        if (query) {
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                var key = state.urlDecode(state, null, param[0], true);
                var val = state.urlDecode(state, key, param[1] || '', true);
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
            if (crumblessUrl.substring(0, 1) !== '/')
                crumblessUrl = '/' + crumblessUrl;
            var { state, data } = this.parseLink(crumblessUrl);
            delete data[state.crumbTrailKey];
            var url = this.getNavigationLink(state, data, crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len));
        }
        return crumbs;
    }
}
export default StateHandler;
