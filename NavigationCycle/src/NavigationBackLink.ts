import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (properties: any, children: any) => {
    var stateController: Navigation.StateController = properties.stateController;
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var link = stateController.getNavigationBackLink(properties.distance);
    newProperties.href = stateController.historyManager.getHref(link);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationBackLink;
