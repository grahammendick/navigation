import Navigation = require('navigation');
import React = require('react');

class LinkUtility {
    static setLink(props: any, linkAccessor: () => string) {
        try {
            props.href = Navigation.settings.historyManager.getHref(linkAccessor());
        } catch (e) {
            props.href = null;
        }
    }

    static getData(toData, includeCurrentData: boolean, currentDataKeys: string): any {
        if (currentDataKeys)
            toData = Navigation.StateContext.includeCurrentData(toData, currentDataKeys.trim().split(/\s*,\s*/));
        if (includeCurrentData)
            toData = Navigation.StateContext.includeCurrentData(toData);
        return toData;
    }
    
    static addListeners(component: React.Component<any, any>, props: any, setLink: () => void, lazy: boolean) {
        props.onClick = (e: MouseEvent) => {
            var element = <HTMLAnchorElement> React.findDOMNode(component);
            if (lazy) {
                setLink();
                if (props.href)
                    element.href = props.href;
                else
                    component.forceUpdate();
            }
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                if (props.href) {
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