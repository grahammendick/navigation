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
    static getData(stateController: Navigation.StateController, toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = stateController.stateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = stateController.stateContext.includeCurrentData(toData);
        return toData;
    }
    
    static isActive(stateController: Navigation.StateController, key: string, val: any): boolean {
        if (!stateController.stateContext.state)
            return false;
        if (val != null) {
            var trackTypes = stateController.stateContext.state.trackTypes;
            var currentVal = stateController.stateContext.data[key];
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
    
    static getHistoryAction(properties: any) {
        var historyAction = properties.historyAction;
        if (typeof historyAction === 'string')
            historyAction = Navigation.HistoryAction[historyAction];
        return historyAction;
    }
}
export = LinkUtility;

