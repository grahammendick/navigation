import { StateNavigator } from 'navigation';
import * as React from 'react';

class LinkUtility {
    static getData(stateNavigator: StateNavigator, navigationData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }

    static isActive(stateNavigator: StateNavigator, navigationData: any): boolean {
        var active = true;
        for (var key in navigationData) {
            var val = navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
        return active;
    }

    static setActive(stateNavigator: StateNavigator, active: boolean, props: any, toProps: any) {
        if (!props.activeCssClass && !props.disableActive)
            return;
        if (active && props.activeCssClass)
            toProps.className = !toProps.className ? props.activeCssClass : toProps.className + ' ' + props.activeCssClass;
        if (active && props.disableActive)
            toProps.href = null;        
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

    static isValidAttribute(attr: string): boolean {
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData' && attr !== 'includeCurrentData'
            && attr !== 'currentDataKeys' && attr !== 'activeCssClass' && attr !== 'disableActive' && attr !== 'distance'
            && attr !== 'lazy' && attr !== 'historyAction' && attr !== 'navigating' && attr !== 'children';
    }
    
    static getOnClick(stateNavigator: StateNavigator, props: any, link: string) {
        return (e) => {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (link) {
                    var navigating = this.getNavigating(props);
                    if (navigating(e, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, props.historyAction);
                    }
                }
            }
        };
    }

    static getNavigating(props: any): (e, link: string) => boolean {
        return (e, link: string) => {
            var listener = props.navigating;
            if (listener)
                return listener(e, undefined, link);
            return true;
        }
    }
}
export default LinkUtility;