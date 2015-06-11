class Segment {
    path: string;
    optional: boolean;
    defaults: any;
    pattern: string = '';
    params: Array<string> = [];
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
            var item = matches[i];
            if (item.charAt(0) == '{') {
                var param = item.substring(1, item.length - 1);
                var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
                this.params.push(name);
                var optionalOrDefault = param.slice(-1) === '?' || this.defaults[name];
                this.optional = this.optional && this.path.length === item.length && optionalOrDefault;
                this.pattern += !this.optional ? '([^/]+)' : '(\/[^/]+)?';
            } else {
                this.optional = false;
                this.pattern += item.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    }

    build(data?: any): { path: string; optional: boolean } {
        var optional = this.optional;
        var blank = false;
        var replaceParam = (match: string, param: string) => {
            var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
            optional = optional && (!data[name] || data[name] === this.defaults[name]);
            var val = data[name] ? data[name] : this.defaults[name];
            blank = blank || !val;
            return encodeURIComponent(val);
        }
        var routePath = this.path.replace(this.paramsPattern, replaceParam);
        return { path: !blank ? routePath : null, optional: optional };
    }
}
export = Segment;
