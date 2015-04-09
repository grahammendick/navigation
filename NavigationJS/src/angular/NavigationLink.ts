import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var action, toData, includeCurrentData, currentDataKeys;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, () => setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys));
            var watchAttrs = [attrs['navigationLink'], attrs['toData'], attrs['includeCurrentData'], attrs['currentDataKeys']];
            scope.$watchGroup(watchAttrs, function (values) {
                action = values[0];
                toData = values[1];
                includeCurrentData = values[2];
                currentDataKeys = values[3];
                setNavigationLink(element, attrs, action, toData, includeCurrentData, currentDataKeys);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes,
    action: string, toData: any, includeCurrentData: boolean, currentDataKeys: string) {
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getNavigationLink(action,
        LinkUtility.getData(toData, includeCurrentData, currentDataKeys))
    );
}

angular.module('NavigationAngular', [])
    .directive('navigationLink', NavigationLink);
export = NavigationLink;
