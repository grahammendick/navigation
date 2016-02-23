import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (stateNavigator: Navigation.StateNavigator, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    try {
        var link = stateNavigator.getNavigationBackLink(properties.distance)
        newProperties.href = stateNavigator.historyManager.getHref(link);
    } catch(e) {
    }
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationBackLink;
