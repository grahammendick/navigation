var NavigationData = (function () {
    function NavigationData() {
    }
    NavigationData.setDefaults = function (data, defaults) {
        for (var key in defaults) {
            if (data[key] == null || !data[key].toString())
                data[key] = defaults[key];
        }
    };

    NavigationData.clone = function (data) {
        var clone = {};
        for (var key in data)
            clone[key] = data[key];
        return clone;
    };
    return NavigationData;
})();
module.exports = NavigationData;
//# sourceMappingURL=NavigationData.js.map
