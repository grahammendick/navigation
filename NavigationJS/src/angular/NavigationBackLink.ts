import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationBackLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var distance;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, () => setNavigationBackLink(element, attrs, distance));
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
