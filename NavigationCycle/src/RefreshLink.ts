import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var RefreshLink = (stateNavigator: Navigation.StateNavigator, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, properties.navigationData[key]);
    }
    var navigationData = LinkUtility.getData(stateNavigator, properties.navigationData, properties.includeCurrentData, properties.currentDataKeys);
    try {
        var link = stateNavigator.getRefreshLink(navigationData);
        newProperties.href = stateNavigator.historyManager.getHref(link);
    } catch(e) {
    }
    active = active && !!newProperties.href;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = RefreshLink;
