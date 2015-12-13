import TypeConverter = require('./TypeConverter');

class StringConverter extends TypeConverter {
    getType(): string {
        return 'string';
    }

    convertFrom(val: string | string[]): any {
        if (typeof val !== 'string')
            throw Error(val + ' is not a valid string');
        return val;
    }

    convertTo(val: any): { val: string, queryStringVal?: string[] } {
        return { val: val.toString() };
    }
}
export = StringConverter;
