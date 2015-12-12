import TypeConverter = require('./TypeConverter');

class ArrayConverter extends TypeConverter {
    private converter: TypeConverter;
    private static SEPARATOR = '-';
    private static SEPARATOR1 = '1-';
    private static SEPARATOR2 = '2-';

    constructor(converter: TypeConverter) {
        super();
        this.converter = converter;
    }

    getType(): string {
        return this.converter.getType() + 'array';
    }

    convertFrom(val: string | string[]): any {
        var arr = [];
        if (typeof val === 'string') {
            if (val.length !== 0) {
                var vals = val.split(ArrayConverter.SEPARATOR1);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR)));
                    else
                        arr.push(null);
                }
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

    convertTo(val: any): { val: string, vals?: string[] } {
        var valArray = [];
        var vals = [];
        var arr: any[] = val;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null && arr[i].toString()) {
                var convertedValue = this.converter.convertTo(arr[i]).val;
                vals.push(convertedValue);
                valArray.push(convertedValue.replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
            } else {
                vals.push('');
                valArray.push('');
            }
        }
        return { val: valArray.join(ArrayConverter.SEPARATOR1), vals: vals };
    }
}
export = ArrayConverter;
