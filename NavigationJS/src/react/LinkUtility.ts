import Navigation = require('navigation');
import React = require('react');

class LinkUtility {
    static cloneProps(elem: React.ReactElement<any, any>): any {
        var props = {};
        for (var key in elem.props) {
            props[key] = elem.props[key];
        }
        return props;
    }

    static setLink(component: any, props: any, linkAccessor: () => string) {
        try {
            props.href = Navigation.historyManager.getHref(linkAccessor());
            props.onClick = (e) => this.onClick(e, component.getDOMNode());
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

    static onClick(e: MouseEvent, element: HTMLAnchorElement) {
        if (!e.ctrlKey && !e.shiftKey) {
            if (element.href) {
                e.preventDefault();
                Navigation.StateController.navigateLink(Navigation.historyManager.getUrl(element));
            }
        }
    }

    static createElement(props: any) {
        delete props.action;
        delete props.toData;
        delete props.includeCurrentData;
        delete props.currentDataKeys;
        delete props.distance;
        return React.createElement(props.href ? 'a' : 'span', props);
    }
}
export = LinkUtility;