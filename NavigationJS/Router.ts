module Navigation {
    export class Router {
        private routes: Array<Route> = [];

        addRoute(path: string, defaults?: any, dataTokens?: any): Route {
            var route = new Route(path, defaults, dataTokens);
            this.routes.push(route);
            return route;
        }

        match(path: string): RouteMatch {
            for (var i = 0; i < this.routes.length; i++) {
                var data = this.routes[i].match(path);
                if (data)
                    return new RouteMatch(this.routes[i], data);
            }
            return null;
        }
    }

    export class RouteMatch {
        route: Route;
        data: any;

        constructor(route: Route, data: any) {
            this.route = route;
            this.data = data;
        }
    }

    export class Route {
        path: string;
        defaults: any;
        dataTokens: any;
        private segments: Array<Segment> = [];
        private pattern: RegExp;
        params: Array<string> = [];

        constructor(path: string, defaults?: any, dataTokens?: any) {
            this.path = path;
            this.defaults = defaults ? defaults : {};
            this.dataTokens = dataTokens ? dataTokens : {};
            this.parse();
        }

        private parse() {
            var subPaths = this.path.split('/').reverse();
            var segments: Array<Segment> = [];
            var mandatory = false;
            for (var i = 0; i < subPaths.length; i++) {
                var segment = new Segment(subPaths[i], mandatory);
                segment.parse(this.defaults);
                segments.push(segment);
                mandatory = mandatory || segment.mandatory;
            }
            this.segments = segments.reverse();
            var subPatterns: Array<string> = [];
            for (var i = 0; i < this.segments.length; i++) {
                var segment = this.segments[i];
                subPatterns.push(segment.pattern.source);
                for (var j = 0; j < segment.params.length; j++) {
                    this.params.push(segment.params[j]);
                }
            }
            this.pattern = new RegExp('^' + subPatterns.join('\/') + '$');
        }

        match(path: string): any {
            var matches = this.pattern.exec(path);
            if (!matches)
                return null;
            var data = {};
            for (var i = 1; i < matches.length; i++) {
                data[this.params[i - 1]] = matches[i];
            }
            return data;
        }
    }

    class Segment {
        path: string;
        mandatory: boolean;
        pattern: RegExp;
        paramsPattern: RegExp = /\{([^}]+)\}/g;
        escapePattern: RegExp = /[\.+*\^$\[\](){}']/g;
        params: Array<string> = [];

        constructor(path: string, mandatory: boolean) {
            this.path = path;
            this.mandatory = mandatory;
        }

        parse(defaults: any) {
            var optional = false;
            var replace = (match: string, param: string) => {
                if (param.slice(-1) === '?')
                    param = param.substring(0, param.length - 1);
                this.params.push(param);
                if (this.path.length === match[0].length && (param.slice(-1) === '?' || defaults[param]))
                    optional = true;
                return '?'
            }
            this.mandatory = this.mandatory || !optional;
            var pattern = this.path.replace(this.paramsPattern, replace);
            pattern = pattern.replace(this.escapePattern, '\\$&');
            pattern = pattern.replace(/\?/g, '([^/]+)' + (this.mandatory ? '' : '?'));
            this.pattern = new RegExp(pattern);
        }
    }
}
