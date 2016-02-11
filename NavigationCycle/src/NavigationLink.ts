import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import CycleDOM = require('@cycle/dom');

function isActive(stateController: Navigation.StateController, action: string): boolean {
    var nextState = stateController.getNextState(action);
    return nextState === nextState.parent.initial && nextState.parent === stateController.stateContext.dialog;
}

var NavigationLink = (properties: any, children: any) => {
    var stateController: Navigation.StateController = properties.stateController;
    var newProperties: any = {};
    for(var key in properties)
        newProperties[key] = properties[key];
    var active = true;
    for (var key in properties.toData) {
        active = active && LinkUtility.isActive(stateController, key, properties.toData[key]);
    }
    var toData = LinkUtility.getData(stateController, properties.toData, properties.includeCurrentData, properties.currentDataKeys);
    var link = stateController.getNavigationLink(properties.action, properties.toData);
    newProperties.href = stateController.historyManager.getHref(link);
    active = active && !!newProperties.href && isActive(stateController, properties.action);
    LinkUtility.setActive(newProperties, active, properties.activeCssClass, properties.disableActive);
    LinkUtility.setHistoryAction(newProperties, properties.historyAction);
    return CycleDOM.h(newProperties.href ? 'a' : 'span', newProperties, children);
}
export = NavigationLink;
