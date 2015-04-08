import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationLink = () => {
    return {
        restrict: 'EA',
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            var action, toData;
            LinkUtility.addClickListener(element);
            LinkUtility.addNavigateHandler(element, () => setNavigationLink(element, attrs, action, toData));
            scope.$watchGroup([
                attrs['navigationLink'],
                attrs['toData'],
                attrs['includeCurrentData'],
                attrs['currentDataKeys']
            ], function (values) {
                action = values[0];
                toData = LinkUtility.getData(values[1], values[2], values[3]);
                setNavigationLink(element, attrs, action, toData);
            });
        }
    }
};

function setNavigationLink(element: ng.IAugmentedJQuery, attrs: ng.IAttributes, action: string, toData: any) {
    LinkUtility.setLink(element, attrs, () => Navigation.StateController.getNavigationLink(action, toData));
}

angular.module('NavigationAngular', [])
    .directive('navigationLink', NavigationLink);
export = NavigationLink;
