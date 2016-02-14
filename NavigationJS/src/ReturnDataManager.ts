import ConverterFactory = require('./converter/ConverterFactory');
import NavigationSettings = require('./NavigationSettings');
import State = require('./config/State');

class ReturnDataManager {
    private static SEPARATOR = '_';
    private static RET_2_SEP = '2_';

    private static decodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    }

    private static encodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    }

    static formatURLObject(settings: NavigationSettings, converterFactory: ConverterFactory, key: string, urlObject: any, state: State, encode = false): { val: string, arrayVal?: string[] } {
        encode = encode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converter = converterFactory.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject, settings.combineArray);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = this.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = this.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += this.RET_2_SEP + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + this.RET_2_SEP + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    }

    static parseURLString(settings: NavigationSettings, converterFactory: ConverterFactory, key: string, val: string | string[], state: State, decode = false, separable = false): any {
        decode = decode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = converterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(this.RET_2_SEP) > -1) {
            var arr = urlValue.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val =  urlValue;
        else
            val[0] = urlValue;
        return converterFactory.getConverterFromKey(converterKey).convertFrom(val, settings.combineArray, separable);
    }
}
export = ReturnDataManager;