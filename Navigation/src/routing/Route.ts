import Segment from './Segment';

class Route {
    path: string;
    defaults: any;
    private segments: Segment[] = [];
    private pattern: RegExp;
    params: { name: string; optional: boolean; splat: boolean }[] = [];
    [index: string]: any;

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
            segment = new Segment(subPaths[i], segment ? segment.optional : true,this.defaults);
            this.segments.unshift(segment);
            pattern = segment.pattern + pattern;
            var params: { name: string; optional: boolean; splat: boolean }[] = [];
            for (var j = 0; j < segment.params.length; j++) {
                var param = segment.params[j];
                params.push({ name: param.name, optional: segment.optional, splat: param.splat });
            }
            this.params = params.concat(this.params);
        }
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    }

    match(path: string, urlDecode: (route: Route, name: string, val: string) => string): any {
        var matches = this.pattern.exec(path);
        if (!matches)
            return null;
        var data = {};
        for (var i = 1; i < matches.length; i++) {
            var param = this.params[i - 1];
            if (matches[i]) {
                var val = !param.optional ? matches[i] : matches[i].substring(1);
                if (val.indexOf('/') === -1) {
                    data[param.name] = urlDecode(this, param.name, val);
                } else {
                    var vals = val.split('/');
                    var decodedVals = [];
                    for(var j = 0; j < vals.length; j++)
                        decodedVals[j] = urlDecode(this, param.name, vals[j]);
                    data[param.name] = decodedVals;
                }
            }
        }
        return data;
    }

    build(data: any, urlEncode: (route: Route, name: string, val: string) => string): string {
        data = data || {};
        var route = '';
        var optional = true;
        var blank = false;
        for (var i = this.segments.length - 1; i >= 0; i--) {
            var segment = this.segments[i];
            var pathInfo = segment.build(data, this.defaults, (name, val) => {
                var encodedValue = urlEncode(this, name, val);
                blank = blank || !encodedValue;
                return encodedValue;
            });
            if (blank)
                return null;
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
export default Route;
