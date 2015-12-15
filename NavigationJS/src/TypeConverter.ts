class TypeConverter {
    getType(): string {
        return null;
    }

    convertFrom(val: string | string[], queryString = false): any {
        return null;
    }

    convertTo(val: any): { val: string, queryStringVal?: string[] } {
        return null;
    }
}
export = TypeConverter;
