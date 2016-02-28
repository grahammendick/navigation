import Crumb = require('./Crumb');
import IRouter = require('./IRouter');
import State = require('./State');

class StateHandler {
    getNavigationLink(router: IRouter, state: State, data: any, arrayData: { [index: string]: string[] } = {}): string {
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

    navigateLink(oldState: State, state: State, url: string) {
    }

    getNavigationData(router: IRouter, state: State, url: string): { data: any, separableData: any } {
        var queryIndex = url.indexOf('?');
        var route = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var { data, separableData } = router.getData(route);
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
        return { data: data, separableData: separableData };
    }

    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[] {
        var newCrumbs: Crumb[] = [];
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state === state)
                break;
            newCrumbs.push(crumbs[i]);
        }
        return newCrumbs;
    }
}
export = StateHandler;
