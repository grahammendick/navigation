import Dialog = require('./config/Dialog');
import IRouter = require('./IRouter');
import Route = require('./routing/Route');
import Router = require('./routing/Router');
import State = require('./config/State');

class StateRouter implements IRouter {
    router: Router;
    supportsDefaults: boolean = true;

    getData(route: string): { state: State; data: any } {
        var match = this.router.match(route);
        return { state: match.route['_state'], data: this.router.match(route).data };
    }

    getRoute(state: State, data: any): { route: string; data: any } {
        var routes: Route[] = state['_routeInfo'].routes;
        var params = state['_routeInfo'].params;
        var paramsKey = '';
        for(var key in params) {
            if (data[key])
                paramsKey += params[key] + ',';
        }
        paramsKey = paramsKey.slice(0, -1);
        var routeInfo: { route: Route; data: any; } = state['_routeInfo'][paramsKey];
        var routePath = null;
        if (routeInfo) {
            routePath = routeInfo.route.build(data);
        } else {
            var bestMatch = StateRouter.findBestMatch(routes, data);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeInfo = { route: bestMatch.route, data: bestMatch.data };
                state['_routeInfo'][paramsKey] = routeInfo;
            }
        }
        return { route: routePath, data: routeInfo ? routeInfo.data : {} };
    }
    
    private static findBestMatch(routes: Route[], data: any): { route: Route; data: any; routePath: string } {
        var bestMatch: { route: Route; data: any; routePath: string };
        var bestMatchCount = -1;
        for(var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var routePath = route.build(data);
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

    addRoutes(dialogs: Dialog[]) {
        this.router = new Router();
        var states: State[] = [];
        for (var i = 0; i < dialogs.length; i++) {
            for (var j = 0; j < dialogs[i]._states.length; j++) {
                states.push(dialogs[i]._states[j]);
            }
        }
        states.sort((stateA, stateB) => {
            var stateANumber = stateA.route.substring(0, 1) === '{' ? -1 : 0;
            var stateBNumber = stateB.route.substring(0, 1) === '{' ? -1 : 0;
            return stateBNumber - stateANumber;
        });
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            var stateRoutes: Route[] = [];
            var params = {};
            var paramsCount = 0;
            var routes = state.route.split(',');
            for(var j = 0; j < routes.length; j++) {
                var stateRoute = this.router.addRoute(routes[j], state.formattedDefaults);
                for(var k = 0; k < stateRoute.params.length; k++){
                    var param = stateRoute.params[k];
                    if (!params[param.name]) {
                        params[param.name] = paramsCount;
                        paramsCount++;
                    }
                }
                stateRoutes.push(stateRoute);
                stateRoute['_state'] = state;
            }
            state['_routeInfo'] = { routes: stateRoutes, params: params };
        }
    }
}
export = StateRouter;
