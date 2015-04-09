/// <reference path="angular.d.ts" />
/// <reference path="jquery.d.ts" />
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');

class NavigationAngular {
    static NavigationBackLink = NavigationBackLink;
    static NavigationLink = NavigationLink;
}
angular.module('NavigationAngular', [])
    .directive('navigationBackLink', NavigationBackLink)
    .directive('navigationLink', NavigationLink);
export = NavigationAngular; 