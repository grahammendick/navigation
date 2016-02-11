import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var RefreshLink = (properties: any, children: any) => {
    var stateController: Navigation.StateController = properties.stateController;
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(stateController, key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(stateController, properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = stateController.getRefreshLink(toData);
    newProperties.href = stateController.historyManager.getHref(link);
    active = active && !!newProperties.href;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = RefreshLink;
