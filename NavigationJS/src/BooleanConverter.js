var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TypeConverter = require('TypeConverter');

var BooleanConverter = (function (_super) {
    __extends(BooleanConverter, _super);
    function BooleanConverter() {
        _super.apply(this, arguments);
    }
    BooleanConverter.prototype.getType = function () {
        return 'boolean';
    };

    BooleanConverter.prototype.convertFrom = function (val) {
        if (val !== 'true' && val !== 'false')
            throw Error(val + ' is not a valid boolean');
        return val === 'true';
    };

    BooleanConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return BooleanConverter;
})(TypeConverter);
module.exports = BooleanConverter;
//# sourceMappingURL=BooleanConverter.js.map
