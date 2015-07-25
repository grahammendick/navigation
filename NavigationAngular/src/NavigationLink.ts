import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var NavigationLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            LinkUtility.addListeners(element, () => setNavigationLink(element, attrs, action, toData, includeCurrentData, 
                currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope)
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                action = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes,
    action: string, toData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(key, toData[key]);
    }
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getNavigationLink(action,
        LinkUtility.getData(toData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'] && isActive(action);
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}

function isActive(action: string): boolean {
    var nextState = Navigation.StateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === Navigation.StateContext.dialog;
}
export = NavigationLink;
