import ConverterFactory = require('./converter/ConverterFactory');
import NavigationDataManager = require('./NavigationDataManager');
import Route = require('./routing/Route');
import State = require('./config/State');
import StateRouter = require('./StateRouter');

class StateHandler {
    static getNavigationLink(router: StateRouter, state: State, data: any, arrayData: { [index: string]: string[] } = {}): string {
        var routeInfo = router.getRoute(state, data, arrayData);
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

    static getNavigationData(router: StateRouter, converterFactory: ConverterFactory, url: string, fromRoute?: Route): { state: State, data: any } {
        var queryIndex = url.indexOf('?');
        var path = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var { state, data, separableData, route } = router.getData(path, fromRoute);
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
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
        data = NavigationDataManager.parseData(converterFactory, data, state, separableData);
        this.validateCrumbTrail(state, data);
        if (state.validate(data))
            return { state: state, data: data };
        else
            return this.getNavigationData(router, converterFactory, url, route);
    }

    private static validateCrumbTrail(state: State, data: any) {
        var crumbTrail: string[] = data[state.crumbTrailKey];
        if (crumbTrail) {
            for(var i = 0; i < crumbTrail.length; i++) {
                var crumb = crumbTrail[i];
                if (crumb.substring(0, 1) !== '/')
                    throw new Error(crumb + ' is not a valid crumb');
            }
        }
    }
}
export = StateHandler;
