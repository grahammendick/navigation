import Crumb = require('./Crumb');
import IStateHandler = require('./IStateHandler');
import settings = require('./settings');
import State = require('./config/State');
import StateContext = require('./StateContext');
import StateController = require('./StateController');

class StateHandler implements IStateHandler {
    getNavigationLink(state: State, data: any, queryStringData: { [index: string]: string[] } = {}): string {
        var routeInfo = settings.router.getRoute(state, data);
        if (routeInfo.route == null)
            return null;
        var query: string[] = [];
        for (var key in data) {
            if (key !== settings.stateIdKey && !routeInfo.data[key]) {
                var arr = queryStringData[key];
                if (!arr) {
                    query.push(this.urlEncode(key, data[key], true));
                } else {
                    for(var i = 0; i < arr.length; i++)
                        query.push(this.urlEncode(key, arr[i], true));
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    }

    navigateLink(oldState: State, state: State, url: string) {
    }

    getNavigationData(state: State, url: string, queryStringData: any = {}): any {
        var queryIndex = url.indexOf('?');
        var route = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var data = settings.router.getData(route).data;
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var { key, val } = this.urlDecode(params[i], true);
                queryStringData[key] = true;
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
        return data;
    }
    
    urlEncode(key: string, val: string, queryString: boolean): string {
        if (queryString)
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        else
            return encodeURIComponent(val);
    }
    
    urlDecode(param: string, queryString: boolean): { key?: string, val: string } {
        if (queryString) {
            var vals = param.split('=');
            return { key: decodeURIComponent(vals[0]), val: decodeURIComponent(vals[1]) };
        } else {
            return { val: decodeURIComponent(param) };
        }
    }

    truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[] {
        var newCrumbs: Crumb[] = [];
        if (state.parent.initial === state)
            return newCrumbs;
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state === state)
                break;
            newCrumbs.push(crumbs[i]);
        }
        return newCrumbs;
    }
}
export = StateHandler;
