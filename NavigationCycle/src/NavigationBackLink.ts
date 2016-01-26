import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationBackLink = (attributes: any, children: any) => {
    var newAttributes: any = {};
    var link = Navigation.StateController.getNavigationBackLink(attributes.distance);
    newAttributes.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newAttributes, children);
}
export = NavigationBackLink;
