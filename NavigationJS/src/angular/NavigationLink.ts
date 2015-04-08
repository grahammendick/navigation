import Navigation = require('../Navigation');

var NavigationLink = () => {
        return {
            restrict: 'A',
            link: (scope: ng.IScope, element, attrs: ng.IAttributes) => {
                scope.$watchGroup([attrs['navigationLink'], attrs['toData']], function (values) {
                    try {
                        var navigationLink = Navigation.StateController.getNavigationLink(values[0], values[1]);
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
