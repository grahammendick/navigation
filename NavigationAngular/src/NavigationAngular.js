var NavigationBackLink = require('./NavigationBackLink');
var NavigationLink = require('./NavigationLink');
var RefreshLink = require('./RefreshLink');
var angular = require('angular');

var NavigationAngular = (function () {
    function NavigationAngular() {
    }
    NavigationAngular.NavigationBackLink = NavigationBackLink;
    NavigationAngular.NavigationLink = NavigationLink;
    NavigationAngular.RefreshLink = RefreshLink;
    return NavigationAngular;
})();
angular.module('NavigationAngular', []).directive('navigationBackLink', NavigationBackLink).directive('navigationLink', NavigationLink).directive('refreshLink', RefreshLink);
module.exports = NavigationAngular;
//# sourceMappingURL=NavigationAngular.js.map
