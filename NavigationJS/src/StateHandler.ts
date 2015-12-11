import Crumb = require('./Crumb');
import IStateHandler = require('./IStateHandler');
import settings = require('./settings');
import State = require('./config/State');
import StateContext = require('./StateContext');
import StateController = require('./StateController');

class StateHandler implements IStateHandler {
    getNavigationLink(state: State, data: any, arrayData: any): string {
        var routeInfo = settings.router.getRoute(state, data);
        if (routeInfo.route == null)
            return null;
        var query: string[] = [];
        for (var key in data) {
            if (key !== settings.stateIdKey && !routeInfo.data[key]) {
                var arrVals: string[] = arrayData[key];
                if (!arrVals)
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
                else {
                    for(var i = 0; i < arrVals.length; i++)
                        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(arrVals[i]));
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    }

    navigateLink(oldState: State, state: State, url: string) {
    }

    getNavigationData(state: State, url: string): any {
        var queryIndex = url.indexOf('?');
        var data = settings.router.getData(queryIndex < 0 ? url : url.substring(0, queryIndex)).data;
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                data[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
            }
        }
        return data;
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
