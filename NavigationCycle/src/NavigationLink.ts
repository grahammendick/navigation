import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationLink = (stateNavigator: Navigation.StateNavigator, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.navigationData) {
        active = active && LinkUtility.isActive(stateNavigator, key, properties.navigationData[key]);
    }
    var navigationData = LinkUtility.getData(stateNavigator, properties.navigationData, properties.includeCurrentData, properties.currentDataKeys);
    try {
        var link = stateNavigator.getNavigationLink(properties.stateKey, navigationData);
        newProperties.href = stateNavigator.historyManager.getHref(link);
    } catch(e) {
    }
    active = active && !!newProperties.href && stateNavigator.stateContext.state && stateNavigator.stateContext.state.key === properties.stateKey;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationLink;
