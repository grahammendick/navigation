var NavigationBackLink = require('./NavigationBackLink');
var NavigationLink = require('./NavigationLink');
var RefreshLink = require('./RefreshLink');

var NavigationKnockout = (function () {
    function NavigationKnockout() {
    }
    NavigationKnockout.NavigationBackLink = NavigationBackLink;
    NavigationKnockout.NavigationLink = NavigationLink;
    NavigationKnockout.RefreshLink = RefreshLink;
    return NavigationKnockout;
})();
module.exports = NavigationKnockout;
//# sourceMappingURL=NavigationKnockout.js.map
