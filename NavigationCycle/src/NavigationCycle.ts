import NavigationDriver = require('./NavigationDriver');
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');

class NavigationCycle {
    static makeNavigationDriver = NavigationDriver; 
    static navigationBackLink = NavigationBackLink;
    static navigationLink = NavigationLink;
    static refreshLink = RefreshLink;
}
export = NavigationCycle;