var ArrayConverter = require('ArrayConverter');
var BooleanConverter = require('BooleanConverter');
var NumberConverter = require('NumberConverter');
var StringConverter = require('StringConverter');

var ConverterFactory = (function () {
    function ConverterFactory() {
    }
    ConverterFactory.init = function () {
        this.typeArray = [];
        this.typeArray.push(function () {
            return new StringConverter();
        });
        this.typeArray.push(function () {
            return new BooleanConverter();
        });
        this.typeArray.push(function () {
            return new NumberConverter();
        });
        this.keyToConverterList = {};
        this.typeToKeyList = {};
        for (var i = 0; i < this.typeArray.length; i++) {
            this.keyToConverterList[i.toString()] = this.typeArray[i]();
            this.keyToConverterList['a' + i] = new ArrayConverter(this.typeArray[i]());
            this.typeToKeyList[this.typeArray[i]().getType()] = i.toString();
            this.typeToKeyList[new ArrayConverter(this.typeArray[i]()).getType()] = 'a' + i;
        }
    };

    ConverterFactory.getKey = function (type) {
        return this.typeToKeyList[type];
    };

    ConverterFactory.getKeyFromObject = function (obj) {
        var fullType = typeof obj;
        var type2;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr = obj;
            type2 = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null) {
                    type2 = typeof arr[i];
                    break;
                }
            }
            fullType = type2 + 'array';
        }
        if (!this.typeToKeyList[fullType])
            throw new Error('No TypeConverter found for ' + !type2 ? fullType : type2);
        return this.typeToKeyList[fullType];
    };

    ConverterFactory.getConverter = function (key) {
        return this.keyToConverterList[key];
    };
    return ConverterFactory;
})();

ConverterFactory.init();
module.exports = ConverterFactory;
//# sourceMappingURL=ConverterFactory.js.map
