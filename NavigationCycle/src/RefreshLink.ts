import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var RefreshLink = (properties: any, children: any) => {
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = Navigation.StateController.getRefreshLink(toData);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    active = active && !!newProperties.href;
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = RefreshLink;
