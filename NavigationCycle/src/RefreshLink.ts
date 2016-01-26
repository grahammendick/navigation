import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var RefreshLink = (properties: any, children: any) => {
    var newProperties: any = {};
    var toData = LinkUtility.getData(properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = Navigation.StateController.getRefreshLink(toData);
    newProperties.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newProperties, children);
}
export = RefreshLink;
