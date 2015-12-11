import TypeConverter = require('./TypeConverter');

class BooleanConverter extends TypeConverter {
    getType(): string {
        return 'boolean';
    }

    convertFrom(val: string): any {
        if (val !== 'true' && val !== 'false')
            throw Error(val + ' is not a valid boolean');
        return val === 'true';
    }

    convertTo(val: any): { val: string, vals?: string[] } {
        return { val: val.toString() };
    }
}
export = BooleanConverter;
