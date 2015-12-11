import TypeConverter = require('./TypeConverter');

class StringConverter extends TypeConverter {
    getType(): string {
        return 'string';
    }

    convertFrom(val: string): any {
        return val;
    }

    convertTo(val: any): { val: string, vals?: string[] } {
        return { val: val.toString() };
    }
}
export = StringConverter;
