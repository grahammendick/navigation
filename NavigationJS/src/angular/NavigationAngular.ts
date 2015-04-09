/// <reference path="angular.d.ts" />
/// <reference path="jquery.d.ts" />
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');

class NavigationAngular {
    static NavigationBackLink = NavigationBackLink;
    static NavigationLink = NavigationLink;
    static RefreshLink = RefreshLink;
}
angular.module('NavigationAngular', [])
    .directive('navigationBackLink', NavigationBackLink)
    .directive('navigationLink', NavigationLink)
    .directive('refreshLink', RefreshLink);
export = NavigationAngular; 