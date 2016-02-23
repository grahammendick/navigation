import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var RefreshLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateNavigator: Navigation.StateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, () => setRefreshLink(element, attrs, stateNavigator, navigationData,
                includeCurrentData, currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope);
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                navigationData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                activeCssClass = values[3];
                disableActive = values[4];
                setRefreshLink(element, attrs, stateNavigator, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setRefreshLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateNavigator: Navigation.StateNavigator,
    navigationData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, navigationData[key]);
    }
    LinkUtility.setLink(stateNavigator, element, attrs, () => stateNavigator.getRefreshLink(
        LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'];
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
export = RefreshLink;
