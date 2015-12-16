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
            var converter = this.converterArray[i];
            this.keyToConverterList[converter.key] = converter;
            var arrayConverter = new ArrayConverter(converter, 'a' + converter.key)
            this.keyToConverterList[arrayConverter.key] = arrayConverter;
            this.nameToKeyList[converter.name] = converter.key;
            this.nameToKeyList[arrayConverter.name] = arrayConverter.key;
        }
    }

    static getConverter(obj: any) {
        return this.getConverterFromName(TypeConverter.getName(obj));
    }

    static getConverterFromKey(key: string): TypeConverter {
        return this.keyToConverterList[key];
    }
    
    static getConverterFromName(name: string): TypeConverter {
        var key = this.nameToKeyList[name];
        if (!key)
            throw new Error('No TypeConverter found for ' + name);
        return this.getConverterFromKey(key);
    }
}

ConverterFactory.init();
export = ConverterFactory;
