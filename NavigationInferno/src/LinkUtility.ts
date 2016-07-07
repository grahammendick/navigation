/// <reference path="navigation.d.ts" />
/// <reference path="inferno-component.d.ts" />
/// <reference path="inferno-create-element.d.ts" />
/// <reference path="inferno-dom.d.ts" />
import Navigation = require('navigation');
import InfernoComponent = require('inferno-component');
import InfernoDOM = require('inferno-dom');

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

    static setActive(props: any, active: boolean, activeCssClass: string, disableActive: boolean) {
        if (active && activeCssClass)
            props.className = !props.className ? activeCssClass : props.className + ' ' + activeCssClass;
        if (active && disableActive)
            props.href = null;        
    }
    
    static addListeners(component: InfernoComponent, stateNavigator: Navigation.StateNavigator, props: any, getLink: () => string) {
        var lazy = !!props.lazy;
        props.onClick = (e: MouseEvent, domId: string) => {
            var element = <HTMLAnchorElement> InfernoDOM.findDOMNode(component);
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
            props.onContextMenu = (e: MouseEvent) => component.forceUpdate();
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