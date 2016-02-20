import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var NavigationLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var state, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive;
            var stateController: Navigation.StateController = scope.$eval(attrs['stateController']);
            LinkUtility.addListeners(element, () => setNavigationLink(element, attrs, stateController, state, toData,
                includeCurrentData, currentDataKeys, activeCssClass, disableActive), $parse, attrs, scope)
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], 
                attrs['currentDataKeys'], attrs['activeCssClass'], attrs['disableActive']];
            scope.$watchGroup(watchAttrs, function (values) {
                state = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                activeCssClass = values[4];
                disableActive = values[5];
                setNavigationLink(element, attrs, stateController, state, toData, includeCurrentData, currentDataKeys, activeCssClass, disableActive);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateController: Navigation.StateController,
    state: string, toData: any, includeCurrentData: boolean, currentDataKeys: string, activeCssClass: string, disableActive: boolean) {
    var active = true;
    for (var key in toData) {
        active = active && LinkUtility.isActive(stateController, key, toData[key]);
    }
    LinkUtility.setLink(stateController, element, attrs, () => stateController.getNavigationLink(state,
        LinkUtility.getData(stateController, toData, includeCurrentData, currentDataKeys))
    );
    active = active && !!attrs['href'] && stateController.stateContext.state.key === state;
    LinkUtility.setActive(element, attrs, active, activeCssClass, disableActive);
}
export = NavigationLink;
