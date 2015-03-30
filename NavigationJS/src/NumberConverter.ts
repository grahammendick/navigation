import TypeConverter = require('./TypeConverter');

class NumberConverter extends TypeConverter {
    getType(): string {
        return 'number';
    }

    convertFrom(val: string): any {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    }

    convertTo(val: any): string {
        return val.toString();
    }
}
export = NumberConverter;
