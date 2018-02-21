import ArrayConverter from './ArrayConverter';
import BooleanConverter from './BooleanConverter';
import DateConverter from './DateConverter';
import NumberConverter from './NumberConverter';
import StringConverter from './StringConverter';
import TypeConverter from './TypeConverter';

class ConverterFactory {
    private keyToConverterList: { [index: string]: TypeConverter } = {};
    private nameToConverterList: { [index: string]: TypeConverter } = {};
    constructor() {
        var converterArray: TypeConverter[] = [
            new StringConverter('0'), new BooleanConverter('1'), 
            new NumberConverter('2'), new DateConverter('3')
        ];
        for (var i = 0; i < converterArray.length; i++) {
            var converter = converterArray[i];
            var arrayConverter = new ArrayConverter(converter, 'a' + converter.key)
            this.keyToConverterList[converter.key] = this.nameToConverterList[converter.name] = converter;
            this.keyToConverterList[arrayConverter.key] = this.nameToConverterList[arrayConverter.name] = arrayConverter;
        }
    }
    
    getConverterFromKey(key: string): TypeConverter {
        return this.keyToConverterList[key];
    }
    
    getConverterFromName(name: string): TypeConverter {
        var converter = this.nameToConverterList[name];
        if (!converter)
            throw new Error('No TypeConverter found for ' + name);
        return converter;
    }
}
export default ConverterFactory;
