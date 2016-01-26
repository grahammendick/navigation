import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (properties: any, children: any) => {
    var newProperties: any = {};
    var link = Navigation.StateController.getNavigationBackLink(properties.distance);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newProperties, children);
}
export = NavigationBackLink;
