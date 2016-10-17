import Route from './Route';

class Router {
    private routes: Route[] = [];

    addRoute(path: string, defaults?: any): Route {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    }

    match(path: string, fromRoute?: Route, urlDecode?: (route: Route, name: string, val: string) => string): { route: Route; data: any } {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        var startMatching = !fromRoute;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            if (startMatching) {
                var data = route.match(path, urlDecode);
                if (data)
                    return { route: route, data: data };
            } else {
                startMatching = route === fromRoute;
            }
        }
        return null;
    }
    
    sort(compare: (routeA: Route, routeB: Route) => number) {
        this.routes.sort(compare);
    }
}
export default Router;
