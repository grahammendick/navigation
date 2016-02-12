import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var NavigationBackLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var distance;
            var stateController: Navigation.StateController = scope.$eval(attrs['stateController']);
            LinkUtility.addListeners(element, () => setNavigationBackLink(element, attrs, stateController, distance), $parse, attrs, scope);
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, stateController, distance);
            });
        }
    }
};

function setNavigationBackLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateController: Navigation.StateController, distance: number) {
    LinkUtility.setLink(stateController, element, attrs, () => stateController.getNavigationBackLink(distance));
}
export = NavigationBackLink;
