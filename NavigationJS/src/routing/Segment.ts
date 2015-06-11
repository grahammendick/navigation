class Segment {
    path: string;
    optional: boolean;
    defaults: any;
    pattern: string = '';
    params: Array<string> = [];
    private parts: Array<{ name: string; param: boolean }> = [];
    private paramsPattern: RegExp = /\{([^}]+)\}/g;
    private escapePattern: RegExp = /[\.+*\^$\[\](){}']/g;
    private itemPattern: RegExp = /[{]{0,1}[^{}]+[}]{0,1}/g;

    constructor(path: string, optional: boolean, defaults?: any) {
        this.path = path;
        this.optional = optional;
        this.defaults = defaults;
        this.parse();
    }

    private parse() {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.itemPattern);
        for (var i = 0; i < matches.length; i++) {
            var part = matches[i];
            if (part.charAt(0) == '{') {
                var param = part.substring(1, part.length - 1);
                var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
                this.params.push(name);
                this.parts.push({ name: name, param: true });
                var optionalOrDefault = param.slice(-1) === '?' || this.defaults[name];
                this.optional = this.optional && this.path.length === part.length && optionalOrDefault;
                this.pattern += !this.optional ? '([^/]+)' : '(\/[^/]+)?';
            } else {
                this.optional = false;
                this.parts.push({ name: part, param: false });
                this.pattern += part.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    }

    build(data?: any): { path: string; optional: boolean } {
        var routePath = '';
        var optional = this.optional;
        var blank = false;
        for(var i = 0; i < this.parts.length; i++) {
            var part = this.parts[i];
            if (!part.param) {
                routePath += part.name;
            } else {
                var val = data[part.name];
                var defaultVal = this.defaults[part.name];
                optional = optional && (!val || val === defaultVal);
                val = val ? val : defaultVal;
                blank = blank || !val;
                routePath += encodeURIComponent(val);
            }
        }
        return { path: !blank ? routePath : null, optional: optional };
    }
}
export = Segment;
