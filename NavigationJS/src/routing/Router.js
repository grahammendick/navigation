var Route = require('Route');

var Router = (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.addRoute = function (path, defaults) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    };

    Router.prototype.match = function (path) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var data = route.match(path);
            if (data) {
                for (var key in route.defaults) {
                    if (!data[key])
                        data[key] = route.defaults[key];
                }
                return { route: route, data: data };
            }
        }
        return null;
    };
    return Router;
})();
module.exports = Router;
//# sourceMappingURL=Router.js.map
