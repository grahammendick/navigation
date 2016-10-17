import ArrayConverter from './ArrayConverter';
import BooleanConverter from './BooleanConverter';
import DateConverter from './DateConverter';
import NumberConverter from './NumberConverter';
import StringConverter from './StringConverter';
import TypeConverter from './TypeConverter';

class ConverterFactory {
    private keyToConverterList: { [index: string]: TypeConverter } = {};
    private nameToKeyList: { [index: string]: string } = {};
    constructor() {
        var converterArray: TypeConverter[] = [
            new StringConverter('0'), new BooleanConverter('1'), 
            new NumberConverter('2'), new DateConverter('3')];
        for (var i = 0; i < converterArray.length; i++) {
            var converter = converterArray[i];
            var arrayConverter = new ArrayConverter(converter, 'a' + converter.key)
            this.keyToConverterList[converter.key] = converter;
            this.keyToConverterList[arrayConverter.key] = arrayConverter;
            this.nameToKeyList[converter.name] = converter.key;
            this.nameToKeyList[arrayConverter.name] = arrayConverter.key;
        }
    }
    
    getConverterFromKey(key: string): TypeConverter {
        return this.keyToConverterList[key];
    }
    
    getConverterFromName(name: string): TypeConverter {
        var key = this.nameToKeyList[name];
        if (!key)
            throw new Error('No TypeConverter found for ' + name);
        return this.getConverterFromKey(key);
    }
}
export default ConverterFactory;
