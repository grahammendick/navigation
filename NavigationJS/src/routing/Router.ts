import Route = require('./Route');

class Router {
    private routes: Array<Route> = [];

    addRoute(path: string, defaults?: any): Route {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    }

    match(path: string): { route: Route; data: any } {
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
    }
}
export = Router;
