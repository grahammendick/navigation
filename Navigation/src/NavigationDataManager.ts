import ConverterFactory from './converter/ConverterFactory';
import State from './config/State';
import TypeConverter from './converter/TypeConverter';

class NavigationDataManager {
    private static SEPARATOR = '1_';
    private converterFactory = new ConverterFactory();

    formatData(state: State, navigationData: any, crumbTrail: string[]): { data: any, arrayData: { [index: string]: string[] }} {
        var data = {};
        var arrayData: { [index: string]: string[] } = {};
        for (var key in navigationData) {
            var val = navigationData[key]; 
            if (val != null && val.length !== 0)
                this.formatDataItem(state, key, val, data, arrayData);
        }
        if (state.trackCrumbTrail && crumbTrail.length > 0)
            this.formatDataItem(state, state.crumbTrailKey, crumbTrail, data, arrayData);
        return { data: data, arrayData: arrayData };
    }
    
    private formatDataItem(state: State, key: string, val: any, data: any, arrayData: any) {
        var formattedData = this.formatURLObject(key, val, state);
        val = formattedData.val;
        if (val !== state.formattedDefaults[key]) {
            data[key] = val;
            arrayData[key] = formattedData.arrayVal;
        }
    }

    private static decodeUrlValue(urlValue: string): string {
        return urlValue.replace(/0_/g, '_');
    }

    private static encodeUrlValue(urlValue: string): string {
        return urlValue.replace(/_/g, '0_');
    }

    formatURLObject(key: string, urlObject: any, state: State, encode = false): { val: string, arrayVal?: string[] } {
        encode = encode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] || 'string';
        var converter = this.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = NavigationDataManager.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = NavigationDataManager.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += NavigationDataManager.SEPARATOR + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + NavigationDataManager.SEPARATOR + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    }


    parseData(data: any, state: State, separableData: any): any {
        var newData = {};
        for (var key in data) {
            if (!NavigationDataManager.isDefault(key, data, state, !!separableData[key]))
                newData[key] = this.parseURLString(key, data[key], state, false, !!separableData[key]);
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

    private parseURLString(key: string, val: string | string[], state: State, decode = false, separable = false): any {
        decode = decode || state.trackTypes;
        var defaultType: string = state.defaultTypes[key] || 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = this.converterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(NavigationDataManager.SEPARATOR) > -1) {
            var arr = urlValue.split(NavigationDataManager.SEPARATOR);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = NavigationDataManager.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val =  urlValue;
        else
            val[0] = urlValue;
        return this.converterFactory.getConverterFromKey(converterKey).convertFrom(val, separable);
    }

    getConverter(obj: any): TypeConverter {
        var fullName = NavigationDataManager.getTypeName(obj);
        if (fullName === 'array') {
            var arr: any[] = obj;
            var subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = NavigationDataManager.getTypeName(arr[i]);
                    break;
                }
            }
            fullName = subName + fullName;
        }
        return this.converterFactory.getConverterFromName(fullName);
    }
    
    private static getTypeName(obj: any): string {
        var typeName: string = typeof obj;
        if (typeName === 'object') {
            typeName = Object.prototype.toString.call(obj);
            typeName = typeName.substring(8, typeName.length - 1).toLowerCase();
        }
        return typeName;
    }
}
export default NavigationDataManager;