import Navigation = require('navigation');
declare var CycleDOM: any;

function getData(toData, includeCurrentData, currentDataKeys) {
    if (currentDataKeys)
        toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
    if (includeCurrentData)
        toData = Navigation.StateContext.includeCurrentData(toData);
    return toData;
}

var RefreshLink = (attributes: any, children: any) => {
    var newAttributes: any = {};
    var toData = getData(attributes.toData, attributes.includeCurrentData, attributes.currentDataKeys);
    var link = Navigation.StateController.getRefreshLink(toData);
    newAttributes.href = Navigation.settings.historyManager.getHref(link);
    return CycleDOM.a(newAttributes, children);
}
export = RefreshLink;
