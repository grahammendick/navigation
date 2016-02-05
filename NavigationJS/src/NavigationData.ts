class NavigationData {
    static setDefaults(data: any, defaults: any) {
        for (var key in defaults) {
            if (data[key] == null || !data[key].toString())
                data[key] = defaults[key];
        }
        return data;
    }

    static clone(data: any) {
        var clone = {};
        for (var key in data)
            clone[key] = data[key];
        return clone;
    }
}
export = NavigationData;
