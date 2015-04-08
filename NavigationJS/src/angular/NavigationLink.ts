import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            scope.$watchGroup([
                attrs['navigationLink'],
                attrs['toData'],
                attrs['includeCurrentData'],
                attrs['currentDataKeys']
            ], function (values) {
                var toData = LinkUtility.getData(values[1], values[2], values[3]);
                LinkUtility.setLink(element, attrs, () => Navigation.StateController.getNavigationLink(values[0], toData));
            });
        }
    }
};
angular.module('NavigationAngular', [])
    .directive('navigationLink', NavigationLink);
export = NavigationLink;
