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

    convertFrom(val: string): any {
        var arr = [];
        if (val.length !== 0) {
            var vals = val.split(ArrayConverter.SEPARATOR1);
            for (var i = 0; i < vals.length; i++) {
                if (vals[i].length !== 0)
                    arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR)));
                else
                    arr.push(null);
            }
        }
        return arr;
    }

    convertTo(val: any): string {
        var formatArray = [];
        var arr: any[] = val;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != null)
                formatArray.push(this.converter.convertTo(arr[i]).replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
        }
        return formatArray.join(ArrayConverter.SEPARATOR1);
    }
}
export = ArrayConverter;
