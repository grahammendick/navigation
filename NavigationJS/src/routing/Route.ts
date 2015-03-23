import Segment = require('./Segment');

class Route {
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
        var segment: Segment;
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
            if (!optional) {
                if (pathInfo.path == null)
                    return null;
                route = '/' + pathInfo.path + route;
            }
        }
        return route.length !== 0 ? route : '/';
    }
}
export = Route;
