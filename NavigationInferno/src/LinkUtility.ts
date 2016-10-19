/// <reference path="navigation.d.ts" />
/// <reference path="inferno-component.d.ts" />
/// <reference path="inferno-create-element.d.ts" />
import * as Navigation from 'navigation';
import InfernoComponent from 'inferno-component';

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

    static setActive(stateNavigator: Navigation.StateNavigator, props: any, toProps: any) {
        if (!props.activeCssClass && !props.disableActive)
            return;
        var active = !!toProps.href;
        for (var key in props.navigationData) {
            var val = props.navigationData[key];
            active = active && (val == null || this.areEqual(val, stateNavigator.stateContext.data[key]));
        }
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
    
    static addListeners(component: InfernoComponent, stateNavigator: Navigation.StateNavigator, props: any, toProps: any, getLink: () => string) {
        var lazy = !!props.lazy;
        toProps.onClick = (e: MouseEvent, domId: string) => {
            var element = <HTMLAnchorElement> component.refs.el;
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
export default LinkUtility;
