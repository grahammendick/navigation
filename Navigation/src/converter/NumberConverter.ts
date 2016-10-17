import TypeConverter from './TypeConverter';

class NumberConverter extends TypeConverter {
    constructor(key: string) {
        super(key, 'number');
    }

    convertFrom(val: string): any {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    }

    convertTo(val: any): { val: string, arrayVal?: string[] } {
        return { val: val.toString() };
    }
}
export default NumberConverter;
