/// <reference path="navigation.d.ts" />
/// <reference path="react.d.ts" />
import Navigation = require('navigation');
import React = require('react');

class LinkUtility {
    static getLink(stateNavigator: Navigation.StateNavigator, linkAccessor: () => string): string {
        try {
            return stateNavigator.historyManager.getHref(linkAccessor());
        } catch (e) {
            return null;
        }
    }

    static getData(stateNavigator: Navigation.StateNavigator, navigationData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            navigationData = stateNavigator.stateContext.includeCurrentData(navigationData);
        return navigationData;
    }

    static isActive(stateNavigator: Navigation.StateNavigator, key: string, val: any): boolean {
        if (!stateNavigator.stateContext.state)
            return false;
        return val == null || this.areEqual(val, stateNavigator.stateContext.data[key]);
    }

    private static areEqual(val: any, currentVal: any): boolean {
        if (currentVal == null)
            return val == null || val === '';
        var valType = Object.prototype.toString.call(val);
        if (valType !== Object.prototype.toString.call(currentVal))
            return false;
        if (valType === '[object Array]') {
            var active = val.length !== currentVal.length;
            for(var i = 0; active && i < val.length; i++) {
                active = this.areEqual(val[i], currentVal[i]);
            }
            return active;
        } else {
            return isNaN(val) ? val === currentVal : +val === +currentVal;
        }
    }

    static setActive(props: any, active: boolean, activeCssClass: string, disableActive: boolean) {
        if (active && activeCssClass)
            props.className = !props.className ? activeCssClass : props.className + ' ' + activeCssClass;
        if (active && disableActive)
            props.href = null;        
    }

    static isValidAttribute(attr: string): boolean {
        return attr !== 'stateNavigator' && attr !== 'stateKey' && attr !== 'navigationData' && attr !== 'includeCurrentData'
            && attr !== 'currentDataKeys' && attr !== 'activeCssClass' && attr !== 'disableActive' && attr !== 'distance'
            && attr !== 'lazy' && attr !== 'historyAction' && attr !== 'navigating' && attr !== 'children';
    }
    
    static addListeners(component: React.Component<any, any>, stateNavigator: Navigation.StateNavigator, props: any, toProps: any, getLink: () => string) {
        var lazy = !!props.lazy;
        toProps.onClick = (e: MouseEvent, domId: string) => {
            var element = <HTMLAnchorElement> component['el'];
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = href;
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = stateNavigator.historyManager.getUrl(element);
                    var navigating = this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        stateNavigator.navigateLink(link, props.historyAction);
                    }
                }
            }
        };
        if (lazy)
            toProps.onContextMenu = (e: MouseEvent) => component.forceUpdate();
    }

    static getNavigating(props: any): (e: MouseEvent, domId: string, link: string) => boolean {
        return (e: MouseEvent, domId: string, link: string) => {
            var listener = props.navigating;
            if (listener)
                return listener(e, domId, link);
            return true;
        }
    }
}
export = LinkUtility;