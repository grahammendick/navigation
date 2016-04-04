import ConverterFactory = require('./converter/ConverterFactory');
import State = require('./config/State');

class NavigationDataManager {
    private static SEPARATOR = '_';
    private static SEPARATOR1 = '1_';

    static formatData(converterFactory: ConverterFactory, state: State, navigationData: any, crumbTrail: string[]): { data: any, arrayData: { [index: string]: string[] }} {
        var data = {};
        var arrayData: { [index: string]: string[] } = {};
        for (var key in navigationData) {
            var val = navigationData[key]; 
            if (val != null && val.toString())
                this.formatDataItem(converterFactory, state, key, val, data, arrayData);
        }
        if (state.trackCrumbTrail && crumbTrail.length > 0)
            this.formatDataItem(converterFactory, state, state.crumbTrailKey, crumbTrail, data, arrayData);
        return { data: data, arrayData: arrayData };
    }
    
    private static formatDataItem(converterFactory: ConverterFactory, state: State, key: string, val: any, data: any, arrayData: any) {
        var formattedData = this.formatURLObject(converterFactory, key, val, state);
        val = formattedData.val;
        if (val !== state.formattedDefaults[key]) {
            data[key] = val;
            arrayData[key] = formattedData.arrayVal;
        }
    }

    private static decodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    }

    private static encodeUrlValue(urlValue: string): string {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    }

    static formatURLObject(converterFactory: ConverterFactory, key: string, urlObject: any, state: State, encode = false): { val: string, arrayVal?: string[] } {
        encode = encode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converter = converterFactory.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = this.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = this.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += this.SEPARATOR1 + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + this.SEPARATOR1 + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    }


    static parseData(converterFactory, data: any, state: State, separableData: any): any {
        var newData = {};
        for (var key in data) {
            if (!this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = this.parseURLString(converterFactory, key, data[key], state, false, !!separableData[key]);
        }
        for (var key in state.defaults) {
            if (newData[key] == null || !newData[key].toString())
                newData[key] = state.defaults[key];
        }
        return newData;
    }
    
    private static isDefault(key: string, data: any, state: State, separable: boolean) {
        var val = data[key]
        var arrayDefaultVal = state.formattedArrayDefaults[key];
        if (!separable || !arrayDefaultVal) {
            return val === state.formattedDefaults[key];
        } else {
            if (typeof val === 'string')
                val = [val];
            if (val.length !== arrayDefaultVal.length) 
                return false;
            for(var i = 0; i < val.length; i++) {
                if (val[i] !== arrayDefaultVal[i])
                    return false;
            }
            return true;
        }
    }

    private static parseURLString(converterFactory: ConverterFactory, key: string, val: string | string[], state: State, decode = false, separable = false): any {
        decode = decode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = converterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(this.SEPARATOR1) > -1) {
            var arr = urlValue.split(this.SEPARATOR1);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val =  urlValue;
        else
            val[0] = urlValue;
        return converterFactory.getConverterFromKey(converterKey).convertFrom(val, separable);
    }
}
export = NavigationDataManager;