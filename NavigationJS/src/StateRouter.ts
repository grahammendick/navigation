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
        var routes: Route[] = state['_routes'];
        var stateRouteInfo = { data: {}, params: -1 }; 
        for(var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var routePath = route.build(data);
            var routeInfo = { data: {}, params: 0 };
            if (routePath) {
                for (var j = 0; j < route.params.length; j++) {
                    if (data[route.params[i].name]) {
                        routeInfo.data[route.params[i].name] = {};
                        routeInfo.params++;
                    }
                }
                if (routeInfo.params > stateRouteInfo.params)
                    stateRouteInfo = routeInfo;
            }
        }
        return { route: route.build(data), data: stateRouteInfo.data };
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
            var routes = state.route.split(',');
            for(var j = 0; j < routes.length; j++) {
                var stateRoute = this.router.addRoute(routes[j], state.formattedDefaults);
                stateRoutes.push(stateRoute);
                stateRoute['_state'] = state;
            }
            state['_routes'] = stateRoutes;
        }
    }
}
export = StateRouter;
