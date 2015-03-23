import ArrayConverter = require('./ArrayConverter');
import BooleanConverter = require('./BooleanConverter');
import NumberConverter = require('./NumberConverter');
import router = require('./router');
import State = require('./config/State');
import StringConverter = require('./StringConverter');
import TypeConverter = require('./TypeConverter');

class ConverterFactory {
    private static typeArray: { (): TypeConverter; }[];
    private static keyToConverterList: any;
    private static typeToKeyList: any;
    private static SEPARATOR = '_';
    private static RET_1_SEP = '1_';
    private static RET_2_SEP = '2_';
    private static RET_3_SEP = '3_';

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
            var arr: Array<any> = obj;
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

    static formatReturnData(state: State, returnData: any): string {
        var returnDataArray: Array<string> = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString()
                && (!router.supportsDefaults || returnData[key] !== state.defaults[key]))
                returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.formatURLObject(key, returnData[key], state));
        }
        return returnDataArray.join(this.RET_3_SEP);
    }

    private static decodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    }

    private static encodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    }

    static formatURLObject(key: string, urlObject: any, state: State) {
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converterKey = ConverterFactory.getKeyFromObject(urlObject);
        var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
        formattedValue = this.encodeUrlValue(formattedValue);
        if (typeof urlObject !== defaultType)
            formattedValue += this.RET_2_SEP + converterKey;
        return formattedValue;
    }

    static parseURLString(key: string, val: string, state: State): any {
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = val;
        var converterKey = ConverterFactory.getKey(defaultType);
        if (val.indexOf(this.RET_2_SEP) > -1) {
            var arr = val.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        return ConverterFactory.getConverter(converterKey).convertFrom(this.decodeUrlValue(urlValue));
    }

    static parseReturnData(returnData: string, state: State): any {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state);
        }
        return navigationData;
    }
}

ConverterFactory.init();
export = ConverterFactory;
