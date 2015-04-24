/// <reference path="../navigation.d.ts" /> 
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');

class NavigationKnockout {
    static NavigationBackLink = NavigationBackLink;
    static NavigationLink = NavigationLink;
    static RefreshLink = RefreshLink;
}
export = NavigationKnockout;