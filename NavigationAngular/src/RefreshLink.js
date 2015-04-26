var LinkUtility = require('./LinkUtility');
var Navigation = require('navigation');

var RefreshLink = function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            var toData, includeCurrentData, currentDataKeys;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, function () {
                return setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys);
            });
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys);
            });
        }
    };
};

function setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys) {
    LinkUtility.setLink(element, attrs, function () {
        return Navigation.StateController.getRefreshLink(LinkUtility.getData(toData, includeCurrentData, currentDataKeys));
    });
}
module.exports = RefreshLink;
//# sourceMappingURL=RefreshLink.js.map
