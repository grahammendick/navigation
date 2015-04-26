var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');

var NavigationBackLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var distance;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () {
                return setNavigationBackLink(element, attrs, distance);
            });
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, distance);
            });
        }
    };
};

function setNavigationBackLink(element, attrs, distance) {
    LinkUtility.setLink(element, attrs, function () {
        return Navigation.StateController.getNavigationBackLink(distance);
    });
}
module.exports = NavigationBackLink;
//# sourceMappingURL=NavigationBackLink.js.map
