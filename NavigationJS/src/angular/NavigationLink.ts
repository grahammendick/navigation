import Navigation = require('../Navigation');

var NavigationLink = () => {
        return {
            restrict: 'A',
            link: (scope: ng.IScope, element, attrs: ng.IAttributes) => {
                scope.$watch(attrs['navigationLink'], function (value) {
                    try {
                        var navigationLink = Navigation.StateController.getNavigationLink(value);
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
