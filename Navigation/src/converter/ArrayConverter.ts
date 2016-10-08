import TypeConverter = require('./TypeConverter');

class ArrayConverter extends TypeConverter {
    private converter: TypeConverter;
    private static SEPARATOR = '1-';

    constructor(converter: TypeConverter, key: string) {
        super(key, converter.name + 'array');
        this.converter = converter;
    }

    convertFrom(val: string | string[], separable: boolean): any {
        var arr = [];
        if (typeof val === 'string') {
            if (!separable) {
                var vals = val.split(ArrayConverter.SEPARATOR);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(/0-/g, '-')));
                    else
                        arr.push(null);
                }
            } else {
                arr.push(this.converter.convertFrom(val));
            }
        } else {
            for(var i = 0; i < val.length; i++) {
                if (val[i].length !== 0)
                    arr.push(this.converter.convertFrom(val[i]));
                else
                    arr.push(null);
            }
        }
        return arr;
    }

    convertTo(val: any[]): { val: string, arrayVal?: string[] } {
        var vals = [];
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            if (val[i] != null && val[i].toString()) {
                var convertedValue = this.converter.convertTo(val[i]).val;
                arr.push(convertedValue);
                vals.push(convertedValue.replace(/-/g, '0-'));
            } else {
                arr.push('');
                vals.push('');
            }
        }
        return { val: vals.join(ArrayConverter.SEPARATOR), arrayVal: arr };
    }
}
export = ArrayConverter;
