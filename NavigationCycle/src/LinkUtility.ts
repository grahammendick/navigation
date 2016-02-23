/// <reference path="navigation.d.ts" />
/// <reference path="cycle-dom.d.ts" />
/// <reference path="rx.d.ts" />
import Navigation = require('navigation');

class HistoryActionHook {
    private historyAction;
    
    constructor(historyAction) {
        this.historyAction = historyAction;    
    }
    
    hook(node) {
        node['historyAction'] = this.historyAction;
    }
}

class LinkUtility {
    static getData(stateNavigator: Navigation.StateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }
    
    static isActive(stateNavigator: Navigation.StateNavigator, key: string, val: any): boolean {
        if (!stateNavigator.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateNavigator.stateContext.state.trackTypes;
            var currentVal = stateNavigator.stateContext.data[key];
            if (currentVal != null)
                return trackTypes ? val === currentVal : val.toString() == currentVal.toString();
            else
                return val === '';
        }
        return true;
    }

    static setActive(properties: any, active: boolean, activeCssClass: string, disableActive: boolean) {
        if (active && activeCssClass)
            properties.className = !properties.className ? activeCssClass : properties.className + ' ' + activeCssClass;
        if (active && disableActive)
            properties.href = null;        
    }
    
    static setHistoryAction(properties: any, historyAction) {
        if (historyAction)
            properties.historyAction = new HistoryActionHook(historyAction);
    }
}
export = LinkUtility;

