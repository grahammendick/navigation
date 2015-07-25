import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var RefreshLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            LinkUtility.addListeners(element, () => setRefreshLink(element, attrs, toData, includeCurrentData, 
                currentDataKeys, activeCssClass, disableActive), !!scope.$eval(attrs['lazy']), scope);
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                activeCssClass = values[3];
                disableActive = values[4];
                setRefreshLink(element, attrs, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setRefreshLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes,
    toData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(key, toData[key]);
    }
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getRefreshLink(
        LinkUtility.getData(toData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'];
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
export = RefreshLink;
