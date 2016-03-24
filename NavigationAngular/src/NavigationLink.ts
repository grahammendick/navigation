import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var NavigationLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateNavigator: Navigation.StateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, () => setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData,
                includeCurrentData, currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope)
            var watchAttrs = [attrs['navigationLink'], attrs['navigationData'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                stateKey = values[0];
                navigationData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, stateNavigator, stateKey, navigationData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateNavigator: Navigation.StateNavigator,
    stateKey: string, navigationData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, navigationData[key]);
    }
    LinkUtility.setLink(stateNavigator, element, attrs, () => stateNavigator.getNavigationLink(stateKey,
        LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'] && stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === stateKey;
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
export = NavigationLink;
