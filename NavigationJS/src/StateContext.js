var StateContext = (function () {
    function StateContext() {
    }
    StateContext.includeCurrentData = function (data, keys) {
        if (!keys) {
            keys = [];
            for (var key in this.data)
                keys.push(key);
        }
        var newData = {};
        for (var i = 0; i < keys.length; i++)
            newData[keys[i]] = this.data[keys[i]];
        for (var key in data)
            newData[key] = data[key];
        return newData;
    };

    StateContext.clear = function (key) {
        if (key)
            this.data[key] = this.state.defaults[key];
        else {
            for (var key in this.data) {
                this.data[key] = this.state.defaults[key];
            }
        }
    };
    return StateContext;
})();
module.exports = StateContext;
//# sourceMappingURL=StateContext.js.map
