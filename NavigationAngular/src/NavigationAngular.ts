import NavigationBackLink from './NavigationBackLink';
import NavigationLink from './NavigationLink';
import RefreshLink from './RefreshLink';
import * as angular from 'angular';

angular.module('NavigationAngular', [])
    .directive('navigationBackLink', NavigationBackLink)
    .directive('navigationLink', NavigationLink)
    .directive('refreshLink', RefreshLink);
export { NavigationBackLink, NavigationLink, RefreshLink };
