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
    
    static addListeners(component: React.Component<any, any>, props: any, getLink: () => string, lazy: boolean) {
        props.onClick = (e: MouseEvent) => {
            var element = <HTMLAnchorElement> React.findDOMNode(component);
            if (lazy)
                element.href = getLink();
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (element.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(element));
                }
            }
        };
        if (lazy)
            props.onMouseDown = (e: MouseEvent) => component.forceUpdate();
    }
}
export = LinkUtility;