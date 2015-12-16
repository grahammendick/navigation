class TypeConverter {
    key: string;
    name: string;
    
    constructor(key: string, name: string) {
        this.key = key;
        this.name = name;
    }
    
    convertFrom(val: string | string[], queryString = false): any {
        return null;
    }

    convertTo(val: any): { val: string, queryStringVal?: string[] } {
        return null;
    }
    
    static getName(obj: any) {
        var fullName = typeof obj;
        var subName: string;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            var arr: any[] = obj;
            subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = typeof arr[i];
                    break;
                }
            }
            fullName = subName + 'array';
        }
        return fullName;
    }
}
export = TypeConverter;
