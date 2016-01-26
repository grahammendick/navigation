import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationLink = (properties: any, children: any) => {
    var newProperties: any = {};
    var link = Navigation.StateController.getNavigationLink(properties.action, properties.toData);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationLink;
