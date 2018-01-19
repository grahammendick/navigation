class Segment {
    path: string;
    optional: boolean;
    pattern: string = '';
    params: { name: string; splat: boolean }[] = [];
    private subSegments: { name: string; param: boolean; splat: boolean, optional: boolean }[] = [];
    private subSegmentPattern: RegExp = /[{]{0,1}[^{}]+[}]{0,1}/g;
    private escapePattern: RegExp = /[\.+*\^$\[\](){}']/g;

    constructor(path: string, optional: boolean, defaults: any) {
        this.path = path;
        this.optional = optional;
        this.parse(defaults);
    }

    private parse(defaults: any) {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.subSegmentPattern);
        for (var i = 0; i < matches.length; i++) {
            var subSegment = matches[i];
            if (subSegment.slice(0, 1) === '{') {
                var param = subSegment.substring(1, subSegment.length - 1);
                var optional = param.slice(-1) === '?';
                var splat = param.slice(0, 1) === '*';
                var name = optional ? param.slice(0, -1) : param;
                name = splat ? name.slice(1) : name;
                this.params.push({ name: name, splat: splat });
                this.optional = this.optional && optional && this.path.length === subSegment.length;
                if (this.path.length === subSegment.length)
                    optional = this.optional;
                this.subSegments.push({ name: name, param: true, splat: splat, optional: optional });
                var subPattern = !splat ? '[^/]+' : '.+';
                this.pattern += !this.optional ? `(${subPattern})` : `(\/${subPattern})`;
                this.pattern += optional ? '?' : '';
            } else {
                this.optional = false;
                this.subSegments.push({ name: subSegment, param: false, splat: false, optional: false });
                this.pattern += subSegment.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    }

    build(data: any, defaults: any, urlEncode: (name: string, val: string) => string): { path: string; optional: boolean } {
        var routePath = '';
        var blank = false;
        var optional = false;
        for(var i = 0; i < this.subSegments.length; i++) {
            var subSegment = this.subSegments[i];
            if (!subSegment.param) {
                routePath += subSegment.name;
            } else {
                var val = data[subSegment.name];
                var defaultVal = defaults[subSegment.name];
                optional = subSegment.optional && (!val || val === defaultVal);
                if (this.optional || !optional) {
                    val = val || defaultVal;
                    blank = blank || !val;
                    if (val) {
                        if (!subSegment.splat || typeof val === 'string' ) {
                            routePath += urlEncode(subSegment.name, val);
                        } else {
                            var encodedVals = [];
                            for(var i = 0; i < val.length; i++)
                                encodedVals[i] = urlEncode(subSegment.name, val[i]); 
                            routePath += encodedVals.join('/');
                        }
                    }
                }
            }
        }
        return { path: !blank ? routePath : null, optional: optional && this.optional };
    }
}
export default Segment;
