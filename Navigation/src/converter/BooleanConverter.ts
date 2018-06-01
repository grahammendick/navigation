import TypeConverter from './TypeConverter';

class BooleanConverter extends TypeConverter {
    constructor(key: string) {
        super(key, 'boolean');
    }

    convertFrom(val: string): any {
        if (val !== 'true' && val !== 'false')
            throw new Error(val + ' is not a valid boolean');
        return val === 'true';
    }

    convertTo(val: any): { val: string, arrayVal?: string[] } {
        return { val: '' + val };
    }
}
export default BooleanConverter;
