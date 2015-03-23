var Segment = (function () {
    function Segment(path, optional, defaults) {
        this.params = [];
        this.paramsPattern = /\{([^}]+)\}/g;
        this.escapePattern = /[\.+*\^$\[\](){}']/g;
        this.path = path;
        this.optional = optional;
        this.defaults = defaults;
        this.parse();
    }
    Segment.prototype.parse = function () {
        var _this = this;
        var optional = this.path.length === 0;
        var replaceParam = function (match, param) {
            var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
            _this.params.push(name);
            var optionalOrDefault = param.slice(-1) === '?' || _this.defaults[name];
            optional = _this.path.length === match.length && optionalOrDefault;
            return '?';
        };
        this.pattern = this.path.replace(this.paramsPattern, replaceParam);
        this.optional = this.optional && optional;
        this.pattern = this.pattern.replace(this.escapePattern, '\\$&');
        if (!this.optional)
            this.pattern = '\/' + this.pattern.replace(/\?/g, '([^/]+)');
        else
            this.pattern = this.pattern.replace(/\?/, '(\/[^/]+)?');
    };

    Segment.prototype.build = function (data) {
        var _this = this;
        var optional = this.optional;
        var blank = false;
        var replaceParam = function (match, param) {
            var name = param.slice(-1) === '?' ? param.substring(0, param.length - 1) : param;
            optional = optional && (!data[name] || data[name] === _this.defaults[name]);
            var val = data[name] ? data[name] : _this.defaults[name];
            blank = blank || !val;
            return encodeURIComponent(val);
        };
        var routePath = this.path.replace(this.paramsPattern, replaceParam);
        return { path: !blank ? routePath : null, optional: optional };
    };
    return Segment;
})();
module.exports = Segment;
//# sourceMappingURL=Segment.js.map
