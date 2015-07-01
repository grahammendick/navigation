import Navigation = require('navigation');
import React = require('react');

class LinkUtility {
    static setLink(component: any, props: any, linkAccessor: () => string) {
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
    
    static addListeners(component: any, props: any, setLink: () => void, lazy: boolean) {
        props.onClick = (e: MouseEvent) => {
            var element = component.getDOMNode();
            if (lazy) {
                setLink();
                element.href = props.href;
            }
            if (!e.ctrlKey && !e.shiftKey) {
                if (element.href) {
                    e.preventDefault();
                    Navigation.StateController.navigateLink(Navigation.settings.historyManager.getUrl(element));
                }
            }
        };
        if (lazy)
            props.onMouseDown = (e: MouseEvent) => component.forceUpdate();
    }

    static createElement(props: any) {
        var clonedProps: any = {};
        for (var key in props) {
            if (key !== 'action' && key !== 'toData' && key !== 'includeCurrentData'
                    && key !== 'currentDataKeys' && key !== 'distance')
            clonedProps[key] = props[key];
        }
        return React.createElement(clonedProps.href ? 'a' : 'span', clonedProps);
    }
}
export = LinkUtility;