class TypeConverter {
    getType(): string {
        return null;
    }

    convertFrom(val: string): any {
        return null;
    }

    convertTo(val: any): { val: string, vals?: string[] } {
        return null;
    }
}
export = TypeConverter;
