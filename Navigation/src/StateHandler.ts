import ConverterFactory = require('./converter/ConverterFactory');
import Crumb = require('./config/Crumb');
import NavigationDataManager = require('./NavigationDataManager');
import Route = require('./routing/Route');
import State = require('./config/State');
import StateRouter = require('./StateRouter');

class StateHandler {
    static getNavigationLink(router: StateRouter, converterFactory: ConverterFactory, state: State, navigationData: any, crumbTrail: string[]): string {
        var { data, arrayData } = NavigationDataManager.formatData(converterFactory, state, navigationData, crumbTrail);
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

    static parseNavigationLink(router: StateRouter, converterFactory: ConverterFactory, url: string, fromRoute?: Route): { state: State, data: any } {
        var queryIndex = url.indexOf('?');
        var path = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var query = queryIndex >= 0 ? url.substring(queryIndex + 1) : null;
        var match = router.getData(path, fromRoute);
        if (!match)
            return null;
        var { state, data, separableData, route } = match;
        try{
            var navigationData = this.getNavigationData(router, converterFactory, query, state, data || {}, separableData);
        } catch(e) {
        }
        return navigationData || this.parseNavigationLink(router, converterFactory, url, route);        
    }

    private static getNavigationData(router: StateRouter, converterFactory: ConverterFactory, query: string, state: State, data: any, separableData: any): { state: State, data: any } {
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
        data = NavigationDataManager.parseData(converterFactory, data, state, separableData);
        data[state.crumbTrailKey] = this.getCrumbs(router, converterFactory, data[state.crumbTrailKey])
        if (state.validate(data))
            return { state: state, data: data };
        return null;
    }

    private static getCrumbs(router: StateRouter, converterFactory: ConverterFactory, crumbTrail: string[]): Crumb[] {
        var crumbs: Crumb[] = [];
        var len = crumbTrail ? crumbTrail.length : 0;
        for(var i = 0; i < len; i++) {
            var crumblessUrl = crumbTrail[i];
            if (crumblessUrl.substring(0, 1) !== '/')
                throw new Error(crumblessUrl + ' is not a valid crumb');
            var { state, data } = this.parseNavigationLink(router, converterFactory, crumblessUrl);
            var url = this.getNavigationLink(router, converterFactory, state, data, crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len));
        }
        return crumbs;
    }
}
export = StateHandler;
