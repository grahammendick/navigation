import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (stateController: Navigation.StateController, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    try {
        var link = stateController.getNavigationBackLink(properties.distance)
        newProperties.href = stateController.historyManager.getHref(link);
    } catch(e) {
    }
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationBackLink;
