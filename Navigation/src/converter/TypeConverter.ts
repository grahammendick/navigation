class TypeConverter {
    key: string;
    name: string;
    
    constructor(key: string, name: string) {
        this.key = key;
        this.name = name;
    }
    
    convertFrom(val: string | string[], separable = false): any {
        return null;
    }

    convertTo(val: any): { val: string, arrayVal?: string[] } {
        return null;
    }
    
    private static getTypeName(obj: any): string {
        var typeName: string = Object.prototype.toString.call(obj);
        return typeName.substring(8, typeName.length - 1).toLowerCase();
    }
    
    static getName(obj: any) {
        var fullName = this.getTypeName(obj);
        if (fullName === 'array') {
            var arr: any[] = obj;
            var subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = this.getTypeName(arr[i]);
                    break;
                }
            }
            fullName = subName + fullName;
        }
        return fullName;
    }
}
export = TypeConverter;
