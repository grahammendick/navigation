import ConverterFactory = require('./ConverterFactory');
import State = require('./config/State');
import settings = require('./settings');

class ReturnDataManager {
    private static SEPARATOR = '_';
    private static RET_1_SEP = '1_';
    private static RET_2_SEP = '2_';
    private static RET_3_SEP = '3_';

    static formatReturnData(state: State, returnData: any): string {
        var returnDataArray: string[] = [];
        for (var key in returnData) {
            if (returnData[key] != null && returnData[key].toString()
                && (!settings.router.supportsDefaults || returnData[key] !== state.defaults[key]))
                returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.formatURLObject(key, returnData[key], state, true));
        }
        return returnDataArray.join(this.RET_3_SEP);
    }

    private static decodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    }

    private static encodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    }

    static formatURLObject(key: string, urlObject: any, state: State, encode?: boolean) {
        encode = encode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converterKey = ConverterFactory.getKeyFromObject(urlObject);
        var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
        if (encode)
            formattedValue = this.encodeUrlValue(formattedValue);
        if (state.trackTypes && typeof urlObject !== defaultType)
            formattedValue += this.RET_2_SEP + converterKey;
        return formattedValue;
    }

    static parseURLString(key: string, val: string, state: State, decode?: boolean): any {
        decode = decode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = val;
        var converterKey = ConverterFactory.getKey(defaultType);
        if (state.trackTypes && val.indexOf(this.RET_2_SEP) > -1) {
            var arr = val.split(this.RET_2_SEP);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        return ConverterFactory.getConverter(converterKey).convertFrom(urlValue);
    }

    static parseReturnData(returnData: string, state: State): any {
        var navigationData = {};
        var returnDataArray = returnData.split(this.RET_3_SEP);
        for (var i = 0; i < returnDataArray.length; i++) {
            var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
            navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state, true);
        }
        return navigationData;
    }
}
export = ReturnDataManager;