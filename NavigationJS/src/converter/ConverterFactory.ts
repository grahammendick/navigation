import ArrayConverter = require('./ArrayConverter');
import BooleanConverter = require('./BooleanConverter');
import NumberConverter = require('./NumberConverter');
import StringConverter = require('./StringConverter');
import TypeConverter = require('./TypeConverter');

class ConverterFactory {
    private static typeArray: TypeConverter[];
    private static keyToConverterList: any;
    private static typeToKeyList: any;

    static init() {
        this.typeArray = [];
        this.typeArray.push(new StringConverter('0'));
        this.typeArray.push(new BooleanConverter('1'));
        this.typeArray.push(new NumberConverter('2'));
        this.keyToConverterList = {};
        this.typeToKeyList = {};
        for (var i = 0; i < this.typeArray.length; i++) {
            var typeConverter = this.typeArray[i];
            this.keyToConverterList[typeConverter.key] = typeConverter;
            var arrayConverterKey = 'a' + typeConverter.key;
            var arrayConverter = new ArrayConverter(typeConverter, arrayConverterKey)
            this.keyToConverterList[arrayConverterKey] = arrayConverter;
            this.typeToKeyList[typeConverter.name] = i.toString();
            this.typeToKeyList[arrayConverter.name] = arrayConverterKey;
        }
    }

    private static getKey(type: string) {
        return this.typeToKeyList[type];
    }
    
    private static getType(obj: any) {
        var fullType = typeof obj;
        var subType: string;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr: any[] = obj;
            subType = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subType = typeof arr[i];
                    break;
                }
            }
            fullType = subType + 'array';
        }
        return fullType;
    }

    private static getKeyFromObject(obj: any) {
        var fullType = this .getType(obj);
        if (!this.typeToKeyList[fullType])
            throw new Error('No TypeConverter found for ' + fullType);
        return this.typeToKeyList[fullType];
    }
    
    static getConverter(obj: any) {
        return this.getConverterFromKey(this.getKeyFromObject(obj));
    }

    static getConverterFromKey(key: string): TypeConverter {
        return this.keyToConverterList[key];
    }
    
    static getConverterFromName(name: string): TypeConverter {
        return this.getConverterFromKey(this.getKey(name));
    }
}

ConverterFactory.init();
export = ConverterFactory;
