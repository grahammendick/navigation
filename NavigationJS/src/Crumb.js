var CrumbTrailManager = require('CrumbTrailManager');
var NavigationData = require('NavigationData');

var Crumb = (function () {
    function Crumb(data, state, last) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.navigationLink = CrumbTrailManager.getHref(this.state, this.data, null);
        NavigationData.setDefaults(this.data, this.state.defaults);
    }
    return Crumb;
})();
module.exports = Crumb;
//# sourceMappingURL=Crumb.js.map
