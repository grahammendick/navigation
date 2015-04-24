/// <reference path="../navigation.d.ts" /> 
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');
import angular = require('angular');

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