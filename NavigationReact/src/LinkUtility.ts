/// <reference path="navigation.d.ts" />
/// <reference path="react.d.ts" />
/// <reference path="react-dom.d.ts" />
import Navigation = require('navigation');
import React = require('react');
import ReactDOM = require('react-dom');

class LinkUtility {
    static getLink(stateController, linkAccessor: () => string): string {
        try {
            return stateController.settings.historyManager.getHref(linkAccessor());
        } catch (e) {
            return null;
        }
    }

    static getData(stateController, toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = stateController.stateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = stateController.stateContext.includeCurrentData(toData);
        return toData;
    }

    static isActive(stateController, key: string, val: any): boolean {
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

    static setActive(props: any, active: boolean, activeCssClass: string, disableActive: boolean) {
        if (active && activeCssClass)
            props.className = !props.className ? activeCssClass : props.className + ' ' + activeCssClass;
        if (active && disableActive)
            props.href = null;        
    }
    
    static addListeners(component: React.Component<any, any>, props: any, getLink: () => string) {
        var lazy = !!props.lazy;
        props.onClick = (e: MouseEvent, domId: string) => {
            var element = <HTMLAnchorElement> ReactDOM.findDOMNode(component);
            var href = element.href;
            if (lazy) {
                component.forceUpdate();
                href = getLink();
                if (href)
                    element.href = href;
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (href) {
                    var link = props.stateController.settings.historyManager.getUrl(element);
                    var navigating = this.getNavigating(props);
                    if (navigating(e, domId, link)) {
                        e.preventDefault();
                        var historyAction = props.historyAction;
                        if (typeof historyAction === 'string')
                            historyAction = Navigation.HistoryAction[historyAction];
                        props.stateController.navigateLink(link, false, historyAction);
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