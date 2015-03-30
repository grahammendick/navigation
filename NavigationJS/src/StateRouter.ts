import Dialog = require('./config/Dialog');
import IRouter = require('./IRouter');
import Route = require('./routing/Route');
import Router = require('./routing/Router');
import NavigationRouting = require('./routing/NavigationRouting');
import State = require('./config/State');

class StateRouter implements IRouter {
    router: Router;
    supportsDefaults: boolean = true;

    getData(route: string): { state: State; data: any } {
        var match = this.router.match(route);
        return { state: match.route['_state'], data: this.router.match(route).data };
    }

    getRoute(state: State, data: any): { route: string; data: any } {
        var route: Route = state['_route'];
        var routeData = {};
        for (var i = 0; i < route.params.length; i++) {
            routeData[route.params[i].name] = data[route.params[i].name];
        }
        return { route: route.build(data), data: routeData };
    }

    addRoutes(dialogs: Array<Dialog>) {
        this.router = new NavigationRouting.Router();
        var states: Array<State> = [];
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
            state['_route'] = this.router.addRoute(state.route, state.formattedDefaults);
            state['_route']['_state'] = state;
        }
    }
}
export = StateRouter;
