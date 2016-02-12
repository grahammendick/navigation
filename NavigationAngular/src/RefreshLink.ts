import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var RefreshLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateController: Navigation.StateController = scope.$eval(attrs['stateController']);
            LinkUtility.addListeners(element, () => setRefreshLink(element, attrs, stateController, toData,
                includeCurrentData, currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope);
            var watchAttrs = [attrs['refreshLink'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                toData = values[0];
                includeCurrentData = values[1];
                currentDataKeys = values[2];
                activeCssClass = values[3];
                disableActive = values[4];
                setRefreshLink(element, attrs, stateController, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setRefreshLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateController: Navigation.StateController,
    toData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(stateController, key, toData[key]);
    }
    LinkUtility.setLink(stateController, element, attrs, () => stateController.getRefreshLink(
        LinkUtility.getData(stateController, toData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'];
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
export = RefreshLink;
