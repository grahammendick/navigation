module Navigation {
    export class Router {
        private routes: Array<Route> = [];

        addRoute(path: string, defaults?: any): Route {
            path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
            path = path.substring(0, 1) === '/' ? path.substring(1) : path;
            var route = new Route(path, defaults);
            this.routes.push(route);
            return route;
        }

        clearRoutes() {
            this.routes = [];
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

    export class Route {
        path: string;
        defaults: any;
        private segments: Array<Segment> = [];
        private pattern: RegExp;
        params: Array<{ name: string; optional: boolean }> = [];

        constructor(path: string, defaults?: any) {
            this.path = path;
            this.defaults = defaults ? defaults : {};
            this.parse();
        }

        private parse() {
            var subPaths = this.path.split('/').reverse();
            var segment : Segment;
            var pattern: string = '';
            for (var i = 0; i < subPaths.length; i++) {
                segment = new Segment(subPaths[i], segment ? segment.optional : true, this.defaults);
                this.segments.unshift(segment);
                pattern = segment.pattern + pattern;
                var params: Array<{ name: string; optional: boolean }> = [];
                for (var j = 0; j < segment.params.length; j++) {
                    params.push({ name: segment.params[j], optional: segment.optional });
                }
                this.params = params.concat(this.params);
            }
            this.pattern = new RegExp('^' + pattern + '$', 'i');
        }

        match(path: string): any {
            var matches = this.pattern.exec(path);
            if (!matches)
                return null;
            var data = {};
            for (var i = 1; i < matches.length; i++) {
                var param = this.params[i - 1];
                if (matches[i])
                    data[param.name] = decodeURIComponent(!param.optional ? matches[i] : matches[i].substring(1));
            }
            return data;
        }

        build(data?: any): string {
            data = data != null ? data : {};
            var route = '';
            var optional = true;
            for (var i = this.segments.length - 1; i >= 0; i--) {
                var segment = this.segments[i];
                var pathInfo = segment.build(data);
                optional = optional && pathInfo.optional;
                if (pathInfo.path == null || (!optional && !pathInfo.path))
                    return null;
                if (!optional)
                    route = '/' + pathInfo.path + route;
            } 
            return route.length !== 0 ? route : '/';
        }
    }

    class Segment {
        path: string;
        optional: boolean;
        defaults: any;
        pattern: string;
        params: Array<string> = [];
        private paramsPattern: RegExp = /\{([^}]+)\}/g;
        private escapePattern: RegExp = /[\.+*\^$\[\](){}']/g;

        constructor(path: string, optional: boolean, defaults?: any) {
            this.path = path;
            this.optional = optional;
            this.defaults = defaults;
            this.parse();
        }

        private parse() {
            var optional = this.path.length === 0;
            var replaceParam = (match: string, param: string) => {
                var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
                this.params.push(name);
                var optionalOrDefault = param.slice(-1) === '?' || this.defaults[name];
                optional = this.path.length === match.length && optionalOrDefault;
                return '?';
            }
            this.pattern = this.path.replace(this.paramsPattern, replaceParam);
            this.optional = this.optional && optional;
            this.pattern = this.pattern.replace(this.escapePattern, '\\$&');
            if (!this.optional)
                this.pattern = '\/' + this.pattern.replace(/\?/g, '([^/]+)');
            else 
                this.pattern = this.pattern.replace(/\?/, '(\/[^/]+)?');
        }

        build(data?: any): { path: string; optional: boolean } {
            var optional = this.optional;
            var invalid = false;
            var replaceParam = (match: string, param: string) => {
                var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
                optional = optional && (!data[name] || data[name] === this.defaults[name]);
                var val = data[name] ? data[name] : this.defaults[name];
                if (!optional && !val)
                    invalid = true;
                return encodeURIComponent(val);
            }
            var routePath = this.path.replace(this.paramsPattern, replaceParam);
            return { path: !invalid ? routePath : null, optional: optional };
        }
    }
}
