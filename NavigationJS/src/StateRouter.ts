import Dialog = require('./config/Dialog');
import IRouter = require('./IRouter');
import Route = require('./routing/Route');
import Router = require('./routing/Router');
import State = require('./config/State');
type RouteInfo = { routes: Route[]; params: { [index: string]: { count: number; splat: boolean} }; matches: any };
type MatchInfo = { route: Route; data: any; routePath: string };

class StateRouter implements IRouter {
    router: Router;
    supportsDefaults: boolean = true;

    getData(route: string, arrayData: any = {}): { state: State; data: any } {
        var match = this.router.match(route, StateRouter.urlDecode);
        var state = match.route['_state'];
        var routeInfo: RouteInfo = state['_routeInfo'];
        for(var key in routeInfo.params) {
            var param = routeInfo.params[key];
            if (param.splat)
                arrayData[key] = true;
        }
        return { state: state, data: match.data };
    }

    getRoute(state: State, data: any, arrayData: { [index: string]: string[] } = {}): { route: string; data: any } {
        var combinedData = {};
        for(var key in data)
            combinedData[key] = data[key];
        var routeInfo: RouteInfo = state['_routeInfo'];
        var paramsKey = '';
        for(var key in routeInfo.params) {
            var param = routeInfo.params[key]; 
            if (combinedData[key])
                paramsKey += param.count + ',';
            var arr = arrayData[key];
            if (param.splat && arr)
                combinedData[key] = arr;
        }
        paramsKey = paramsKey.slice(0, -1);
        var routeMatch: { route: Route; data: any; } = routeInfo.matches[paramsKey];
        var routePath: string = null;
        if (routeMatch) {
            routePath = routeMatch.route.build(combinedData, StateRouter.urlEncode);
        } else {
            var bestMatch = StateRouter.findBestMatch(routeInfo.routes, combinedData);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeMatch = { route: bestMatch.route, data: bestMatch.data };
                routeInfo.matches[paramsKey] = routeMatch;
            }
        }
        return { route: routePath, data: routeMatch ? routeMatch.data : {} };
    }
    
    private static findBestMatch(routes: Route[], data: any): MatchInfo {
        var bestMatch: MatchInfo;
        var bestMatchCount = -1;
        for(var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var routePath = route.build(data, StateRouter.urlEncode);
            if (routePath) {
                var count = 0;
                var routeData = {};
                for (var j = 0; j < route.params.length; j++) {
                    if (data[route.params[j].name]) {
                        routeData[route.params[j].name] = {};
                        count++;
                    }
                }
                if (count > bestMatchCount) {
                    bestMatch = { route: route, data: routeData, routePath: routePath };
                    bestMatchCount = count;
                }
            }
        }
        return bestMatch;
    }

    private static urlEncode(route: Route, name: string, val: string): string {
        var state: State = route['_state'];
        if (state.stateHandler.urlEncode)
            return state.stateHandler.urlEncode(state, name, val, false);
        else
            return encodeURIComponent(val);
    }

    private static urlDecode(route: Route, name: string, val: string): string {
        var state: State = route['_state'];
        if (state.stateHandler.urlDecode)
            return state.stateHandler.urlDecode(state, name, val, false);
        else
            return decodeURIComponent(val);
    }

    addRoutes(dialogs: Dialog[]) {
        this.router = new Router();
        for (var i = 0; i < dialogs.length; i++) {
            for (var j = 0; j < dialogs[i]._states.length; j++) {
                this.addStateRoutes(dialogs[i]._states[j]);
            }
        }
        this.router.sort((routeA: Route, routeB: Route) => {
            var routeANumber = routeA.path.charAt(0) === '{' ? -1 : 0;
            var routeBNumber = routeB.path.charAt(0) === '{' ? -1 : 0;
            return routeBNumber - routeANumber;
        });
    }
    
    private addStateRoutes(state: State) {
        var routeInfo: RouteInfo = { routes: [], params: {}, matches: {} }; 
        var count = 0;
        var routes = StateRouter.getRoutes(state);
        for(var i = 0; i < routes.length; i++) {
            var route = this.router.addRoute(routes[i], state.formattedDefaults);
            for(var j = 0; j < route.params.length; j++) {
                var param = route.params[j];
                if (!routeInfo.params[param.name]) {
                    routeInfo.params[param.name] = { count: count, splat: param.splat };
                    count++;
                }
            }
            routeInfo.routes.push(route);
            route['_state'] = state;
        }
        state['_routeInfo'] = routeInfo;
    }
    
    private static getRoutes(state: State): string[] {
        var routes: string[] = [];
        var route = state.route;
        if (typeof route === 'string') {
            routes.push(route);
        } else {
            for(var i = 0; i < route.length; i++) {
                routes.push(route[i]);
            }
        }
        return routes;
    }
}
export = StateRouter;
