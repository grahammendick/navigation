import Navigation = require('../Navigation');

var NavigationLink = () => {
        return {
            restrict: 'A',
            link: (scope, element, attrs) => {
                try {
                    var navigationLink = Navigation.StateController.getNavigationLink(attrs.navigationLink);
                    element.href = Navigation.historyManager.getHref(navigationLink);
                } catch (e) {
                }
            }
        }
    };

angular.module('NavigationAngular')
    .directive('NavigationLink', NavigationLink);
export = NavigationLink;
