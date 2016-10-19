import LinkUtility from './LinkUtility';
import * as Navigation from 'navigation';
import * as angular from 'angular';

var NavigationBackLink = ($parse: ng.IParseService) => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var distance;
            var stateNavigator: Navigation.StateNavigator = scope.$eval(attrs['stateNavigator']);
            LinkUtility.addListeners(element, () => setNavigationBackLink(element, attrs, stateNavigator, distance), $parse, attrs, scope);
            scope.$watch(attrs['navigationBackLink'], function (value) {
                distance = value;
                setNavigationBackLink(element, attrs, stateNavigator, distance);
            });
        }
    }
};

function setNavigationBackLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, stateNavigator: Navigation.StateNavigator, distance: number) {
    LinkUtility.setLink(stateNavigator, element, attrs, () => stateNavigator.getNavigationBackLink(distance));
}
export default NavigationBackLink;
