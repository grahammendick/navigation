import ArrayConverter = require('./ArrayConverter');
import BooleanConverter = require('./BooleanConverter');
import NumberConverter = require('./NumberConverter');
import StringConverter = require('./StringConverter');
import TypeConverter = require('./TypeConverter');

class ConverterFactory {
    private static converterArray: TypeConverter[];
    private static keyToConverterList: any;
    private static nameToKeyList: any;

    static init() {
        this.converterArray = [];
        this.converterArray.push(new StringConverter('0'));
        this.converterArray.push(new BooleanConverter('1'));
        this.converterArray.push(new NumberConverter('2'));
        this.keyToConverterList = {};
        this.nameToKeyList = {};
        for (var i = 0; i < this.converterArray.length; i++) {
            var typeConverter = this.converterArray[i];
            this.keyToConverterList[typeConverter.key] = typeConverter;
            var arrayConverterKey = 'a' + typeConverter.key;
            var arrayConverter = new ArrayConverter(typeConverter, arrayConverterKey)
            this.keyToConverterList[arrayConverterKey] = arrayConverter;
            this.nameToKeyList[typeConverter.name] = i.toString();
            this.nameToKeyList[arrayConverter.name] = arrayConverterKey;
        }
    }

    private static getKey(type: string) {
        return this.nameToKeyList[type];
    }
    
    private static getName(obj: any) {
        var fullName = typeof obj;
        var subName: string;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr: any[] = obj;
            subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = typeof arr[i];
                    break;
                }
            }
            fullName = subName + 'array';
        }
        return fullName;
    }

    private static getKeyFromObject(obj: any) {
        var name = this.getName(obj);
        if (!this.nameToKeyList[name])
            throw new Error('No TypeConverter found for ' + name);
        return this.nameToKeyList[name];
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
