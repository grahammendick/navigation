var NavigationBackLink = require('./NavigationBackLink');
var NavigationLink = require('./NavigationLink');
var RefreshLink = require('./RefreshLink');

var NavigationReact = (function () {
    function NavigationReact() {
    }
    NavigationReact.NavigationBackLink = NavigationBackLink;
    NavigationReact.NavigationLink = NavigationLink;
    NavigationReact.RefreshLink = RefreshLink;
    return NavigationReact;
})();
module.exports = NavigationReact;
//# sourceMappingURL=NavigationReact.js.map
