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
}
export = TypeConverter;
