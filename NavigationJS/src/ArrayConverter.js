var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TypeConverter = require('TypeConverter');

var ArrayConverter = (function (_super) {
    __extends(ArrayConverter, _super);
    function ArrayConverter(converter) {
        _super.call(this);
        this.converter = converter;
    }
    ArrayConverter.prototype.getType = function () {
        return this.converter.getType() + 'array';
    };

    ArrayConverter.prototype.convertFrom = function (val) {
        var arr = [];
        if (val.length !== 0) {
            var vals = val.split(ArrayConverter.SEPARATOR1);
            for (var i = 0; i < vals.length; i++) {
                if (vals[i].length !== 0)
                    arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR)));
                else
                    arr.push(null);
            }
        }
        return arr;
    };

    ArrayConverter.prototype.convertTo = function (val) {
        var formatArray = [];
        var arr = val;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null)
                formatArray.push(this.converter.convertTo(arr[i]).replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
        }
        return formatArray.join(ArrayConverter.SEPARATOR1);
    };
    ArrayConverter.SEPARATOR = '-';
    ArrayConverter.SEPARATOR1 = '1-';
    ArrayConverter.SEPARATOR2 = '2-';
    return ArrayConverter;
})(TypeConverter);
module.exports = ArrayConverter;
//# sourceMappingURL=ArrayConverter.js.map
