var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TypeConverter = require('TypeConverter');

var NumberConverter = (function (_super) {
    __extends(NumberConverter, _super);
    function NumberConverter() {
        _super.apply(this, arguments);
    }
    NumberConverter.prototype.getType = function () {
        return 'number';
    };

    NumberConverter.prototype.convertFrom = function (val) {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    };

    NumberConverter.prototype.convertTo = function (val) {
        return val.toString();
    };
    return NumberConverter;
})(TypeConverter);
module.exports = NumberConverter;
//# sourceMappingURL=NumberConverter.js.map
