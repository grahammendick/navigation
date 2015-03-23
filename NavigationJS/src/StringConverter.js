var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TypeConverter = require('TypeConverter');

var StringConverter = (function (_super) {
    __extends(StringConverter, _super);
    function StringConverter() {
        _super.apply(this, arguments);
    }
    StringConverter.prototype.getType = function () {
        return 'string';
    };

    StringConverter.prototype.convertFrom = function (val) {
        return val;
    };

    StringConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return StringConverter;
})(TypeConverter);
module.exports = StringConverter;
//# sourceMappingURL=StringConverter.js.map
