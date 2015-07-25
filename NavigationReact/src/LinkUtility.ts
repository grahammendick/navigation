import Navigation = require('navigation');
import React = require('react');

class LinkUtility {
    static getLink(linkAccessor: () => string): string {
        try {
            return Navigation.settings.historyManager.getHref(linkAccessor());
        } catch (e) {
            return null;
        }
    }

    static getData(toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }

    static isActive(key: string, val: any): boolean {
        if (!Navigation.StateContext.state)
            return false;
        if (val != null && val.toString()) {
            var trackTypes = Navigation.StateContext.state.trackTypes;
            var currentVal = Navigation.StateContext.data[key];
            return currentVal != null && (trackTypes ? val === currentVal : val.toString() == currentVal.toString());
        }
        return true;
    }

    static setActive(props: any, active: boolean, activeCssClass: string, disableActive: boolean) {
        if (active && activeCssClass)
            props.className = !props.className ? activeCssClass : props.className + ' ' + activeCssClass;
        if (active && disableActive)
            props.href = null;        
    }
    
    static addListeners(component: React.Component<any, any>, props: any, getLink: () => string) {
        var lazy = !!props.lazy;
        props.onClick = (e: MouseEvent, domId: string) => {
            var element = <HTMLAnchorElement> React.findDOMNode(component);
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = getLink();
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = Navigation.settings.historyManager.getUrl(element);
                    var navigating = this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        Navigation.StateController.navigateLink(link);
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