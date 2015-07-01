import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var RefreshLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var toData, includeCurrentData, currentDataKeys;
            LinkUtility.addListeners(element, () => setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys), !!scope.$eval(attrs['lazy']));
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys);
            });
        }
    }
};

function setRefreshLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes,
    toData: any, includeCurrentData: boolean, currentDataKeys: string) {
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getRefreshLink(
        LinkUtility.getData(toData, includeCurrentData, currentDataKeys))
    );
}
export = RefreshLink;
