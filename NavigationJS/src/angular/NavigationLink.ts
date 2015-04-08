import LinkUtility = require('./LinkUtility');
import Navigation = require('../Navigation');

var NavigationLink = () => {
        return {
            restrict: 'A',
            link: (scope: ng.IScope, element, attrs: ng.IAttributes) => {
                scope.$watchGroup([
                    attrs['navigationLink'],
                    attrs['toData'],
                    attrs['includeCurrentData'],
                    attrs['currentDataKeys']
                ], function (values) {
                    try {
                        var toData = LinkUtility.getData(values[1], values[2], values[3]);
                        var navigationLink = Navigation.StateController.getNavigationLink(values[0], toData);
                        attrs.$set('href', Navigation.historyManager.getHref(navigationLink));
                    } catch (e) {
                        attrs.$set('href', null);
                    }
                });
            }
        }
    };

angular.module('NavigationAngular', [])
    .directive('navigationLink', NavigationLink);
export = NavigationLink;
