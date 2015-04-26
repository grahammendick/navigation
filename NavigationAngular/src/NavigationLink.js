var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');

var NavigationLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var action, toData, includeCurrentData, currentDataKeys;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () {
                return setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys);
            });
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                action = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys);
            });
        }
    };
};

function setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys) {
    LinkUtility.setLink(element, attrs, function () {
        return Navigation.StateController.getNavigationLink(action, LinkUtility.getData(toData, includeCurrentData, currentDataKeys));
    });
}
module.exports = NavigationLink;
//# sourceMappingURL=NavigationLink.js.map
