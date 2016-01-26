import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationLink = (attributes: any, children: any) => {
    var newAttributes: any = {};
    var link = Navigation.StateController.getNavigationLink(attributes.action, attributes.toData);
    newAttributes.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newAttributes, children);
}
export = NavigationLink;
