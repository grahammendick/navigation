module Navigation {
    export class Router {
        private routes: Array<Route> = [];

        addRoute(path: string, defaults?: any, dataTokens?: any) {
            var route = new Route(path, defaults, dataTokens);
            this.routes.push(route);
        }

        match(path: string): Route {
            for (var i = 0; i < this.routes.length; i++) {
                if (this.routes[i].match(path))
                    return this.routes[i];
            }
            return null;
        }
    }

    export class Route {
        path: string;
        defaults: any;
        dataTokens: any;
        private segments: Array<Segment> = [];
        private pattern: RegExp;

        constructor(path: string, defaults?: any, dataTokens?: any) {
            this.path = path;
            this.defaults = defaults;
            this.dataTokens = dataTokens;
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
                subPatterns.push(this.segments[i].pattern.source);
            }
            this.pattern = new RegExp('^' + subPatterns.join('\/') + '$');
        }

        match(path: string) {
            return this.pattern.test(path);
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
            var match: RegExpExecArray;
            this.paramsPattern.lastIndex = 0;
            var optional = false;
            while (match = this.paramsPattern.exec(this.path)) {
                var param = match[1];
                if (param.slice(-1) === '?')
                    param = param.substring(0, param.length - 1);
                this.params.push(param);
                if (this.path.length === match[0].length && (param.slice(-1) === '?' || defaults[param]))
                    optional = true;
            }
            this.paramsPattern.lastIndex = 0;
            this.mandatory = this.mandatory || !optional;
            var pattern = this.path.replace(this.paramsPattern, '?');
            pattern = pattern.replace(this.escapePattern, '\\$&');
            pattern = pattern.replace(/\\?/g, '([^/]+)' + (this.mandatory ? '' : '?'));
            this.pattern = new RegExp(pattern);
        }    
    }
} 