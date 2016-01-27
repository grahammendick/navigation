import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var link = Navigation.StateController.getNavigationBackLink(properties.distance);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationBackLink;
