import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

var RefreshLink = (attributes: any, children: any) => {
    var newAttributes: any = {};
    var toData = LinkUtility.getData(attributes.toData, attributes.includeCurrentData, attributes.currentDataKeys);
    var link = Navigation.StateController.getRefreshLink(toData);
    newAttributes.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newAttributes, children);
}
export = RefreshLink;
