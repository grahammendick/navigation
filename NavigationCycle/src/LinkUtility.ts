/// <reference types="navigation" />
/// <reference path="cycle-dom.d.ts" />
/// <reference path="rx.d.ts" />
import { StateNavigator } from 'navigation';

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
    static getData(stateNavigator: StateNavigator, navigationData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }
    

    static setActive(stateNavigator: StateNavigator, properties: any, newProperties: any) {
        if (!properties.activeCssClass && !properties.disableActive)
            return;
        var active = !!newProperties.href;
        for (var key in properties.navigationData) {
            var val = properties.navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        if (active && properties.activeCssClass)
            newProperties.className = !newProperties.className ? properties.activeCssClass : newProperties.className + ' ' + properties.activeCssClass;
        if (active && properties.disableActive)
            newProperties.href = null;
    }

    private static areEqual(val: any, currentVal: any): boolean {
        if (currentVal == null)
            return val == null || val === '';
        var valType = Object.prototype.toString.call(val);
        if (valType !== Object.prototype.toString.call(currentVal))
            return false;
        if (valType === '[object Array]') {
            var active = val.length === currentVal.length;
            for(var i = 0; active && i < val.length; i++) {
                active = this.areEqual(val[i], currentVal[i]);
            }
            return active;
        } else {
            return isNaN(val) ? val === currentVal : +val === +currentVal;
        }
    }
    
    static setHistoryAction(properties: any, historyAction) {
        if (historyAction)
            properties.historyAction = new HistoryActionHook(historyAction);
    }
}
export default LinkUtility;
