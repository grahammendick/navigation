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
