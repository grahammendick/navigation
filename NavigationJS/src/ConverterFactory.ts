import ArrayConverter = require('./ArrayConverter');
import BooleanConverter = require('./BooleanConverter');
import NumberConverter = require('./NumberConverter');
import StringConverter = require('./StringConverter');
import TypeConverter = require('./TypeConverter');

class ConverterFactory {
    private static typeArray: { (): TypeConverter; }[];
    private static keyToConverterList: any;
    private static typeToKeyList: any;

    static init() {
        this.typeArray = [];
        this.typeArray.push(() => new StringConverter());
        this.typeArray.push(() => new BooleanConverter());
        this.typeArray.push(() => new NumberConverter());
        this.keyToConverterList = {};
        this.typeToKeyList = {};
        for (var i = 0; i < this.typeArray.length; i++) {
            this.keyToConverterList[i.toString()] = this.typeArray[i]();
            this.keyToConverterList['a' + i] = new ArrayConverter(this.typeArray[i]());
            this.typeToKeyList[this.typeArray[i]().getType()] = i.toString();
            this.typeToKeyList[new ArrayConverter(this.typeArray[i]()).getType()] = 'a' + i;
        }
    }

    static getKey(type: string) {
        return this.typeToKeyList[type];
    }

    static getKeyFromObject(obj: any) {
        var fullType = typeof obj;
        var type2: string;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr: any[] = obj;
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
    }

    static getConverter(key: string): TypeConverter {
        return this.keyToConverterList[key];
    }

}

ConverterFactory.init();
export = ConverterFactory;
