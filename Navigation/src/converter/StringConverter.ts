import TypeConverter from './TypeConverter';

class StringConverter extends TypeConverter {
    constructor(key: string) {
        super(key, 'string');
    }

    convertFrom(val: string | string[]): any {
        if (typeof val !== 'string')
            throw new Error(val + ' is not a valid string');
        return val;
    }

    convertTo(val: any): { val: string, arrayVal?: string[] } {
        return { val: '' + val };
    }
}
export default StringConverter;
