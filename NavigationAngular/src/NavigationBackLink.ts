import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import angular = require('angular');

var NavigationBackLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var distance;
            LinkUtility.addListeners(element, () => setNavigationBackLink(element, attrs, distance), $parse, attrs, scope);
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, distance);
            });
        }
    }
};

function setNavigationBackLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, distance: number) {
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getNavigationBackLink(distance));
}
export = NavigationBackLink;
