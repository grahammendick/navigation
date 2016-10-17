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
}
export default TypeConverter;
