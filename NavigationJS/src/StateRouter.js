var Router = require('routing/Router');

var StateRouter = (function () {
    function StateRouter() {
        this.supportsDefaults = true;
    }
    StateRouter.prototype.getData = function (route) {
        var match = this.router.match(route);
        return { state: match.route['_state'], data: this.router.match(route).data };
    };

    StateRouter.prototype.getRoute = function (state, data) {
        var route = state['_route'];
        var routeData = {};
        for (var i = 0; i < route.params.length; i++) {
            routeData[route.params[i].name] = data[route.params[i].name];
        }
        return { route: route.build(data), data: routeData };
    };

    StateRouter.prototype.addRoutes = function (dialogs) {
        this.router = new Router();
        var states = [];
        for (var i = 0; i < dialogs.length; i++) {
            for (var j = 0; j < dialogs[i]._states.length; j++) {
                states.push(dialogs[i]._states[j]);
            }
        }
        states.sort(function (stateA, stateB) {
            var stateANumber = stateA.route.substring(0, 1) === '{' ? -1 : 0;
            var stateBNumber = stateB.route.substring(0, 1) === '{' ? -1 : 0;
            return stateBNumber - stateANumber;
        });
        for (var i = 0; i < states.length; i++) {
            var state = states[i];
            state['_route'] = this.router.addRoute(state.route, state.formattedDefaults);
            state['_route']['_state'] = state;
        }
    };
    return StateRouter;
})();
module.exports = StateRouter;
//# sourceMappingURL=StateRouter.js.map
