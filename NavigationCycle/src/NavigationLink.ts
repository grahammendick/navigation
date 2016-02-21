import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var NavigationLink = (stateController: Navigation.StateController, properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(stateController, key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(stateController, properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    try {
        var link = stateController.getNavigationLink(properties.state, properties.toData);
        newProperties.href = stateController.historyManager.getHref(link);
    } catch(e) {
    }
    active = active && !!newProperties.href && stateController.stateContext.state.key === properties.state;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationLink;
