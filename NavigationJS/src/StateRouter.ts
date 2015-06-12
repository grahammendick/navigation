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
                paramsKey += key + ',';
        }
        paramsKey = paramsKey.slice(0, -1);
        var stateRouteInfo: { route: Route; data: any; count: number } = state['_routeInfo'][paramsKey];
        var routePath = null;
        if (stateRouteInfo) {
            routePath = stateRouteInfo.route.build(data);
        } else {
            for(var i = 0; i < routes.length; i++) {
                var route = routes[i];
                routePath = route.build(data);
                if (routePath) {
                    var routeInfo = { route: route, data: {}, count: 0 };
                    for (var j = 0; j < route.params.length; j++) {
                        if (data[route.params[j].name]) {
                            routeInfo.data[route.params[j].name] = {};
                            routeInfo.count++;
                        }
                    }
                    if (!stateRouteInfo || routeInfo.count > stateRouteInfo.count)
                        stateRouteInfo = routeInfo;
                }
            }
            state['_routeInfo'][paramsKey] = stateRouteInfo;
        }
        return { route: routePath, data: stateRouteInfo ? stateRouteInfo.data : {} };
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
            var routes = state.route.split(',');
            for(var j = 0; j < routes.length; j++) {
                var stateRoute = this.router.addRoute(routes[j], state.formattedDefaults);
                for(var k = 0; k < stateRoute.params.length; k++){
                    var param = stateRoute.params[k];
                    if (!params[param.name])
                        params[param.name] = {};
                }
                stateRoutes.push(stateRoute);
                stateRoute['_state'] = state;
            }
            state['_routeInfo'] = { routes: stateRoutes, params: params };
        }
    }
}
export = StateRouter;
