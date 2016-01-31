/// <reference path="navigation.d.ts" />
/// <reference path="cycle-dom.d.ts" />
/// <reference path="rx.d.ts" />
import Navigation = require('navigation');

class LinkUtility {
    static getData(toData, includeCurrentData, currentDataKeys) {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }
    
    static isActive(key: string, val: any): boolean {
        if (!Navigation.StateContext.state)
            return false;
        if (val != null) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
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
    
    static setHistory(properties: any, historyAction) {
        if (typeof historyAction === 'string')
            properties.historyAction = Navigation.HistoryAction[historyAction];
        if (properties.historyAction) {
            if (!properties.attributes)
                properties.attributes = {};
            properties.attributes['data-history-action'] = properties.historyAction.toString();
        }
    }
}
export = LinkUtility;

