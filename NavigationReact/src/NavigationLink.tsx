import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { NavigationLinkProps } from './Props';
import * as React from 'react';

var NavigationLink = (props: NavigationLinkProps) => {
    var htmlProps: any = {};
    for(var key in props) {
        if (LinkUtility.isValidAttribute(key))
            htmlProps[key] = props[key];
    }
    var { stateKey, navigationData, includeCurrentData, currentDataKeys, stateNavigator, children } = props;
    var { state } = stateNavigator.stateContext;
    navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
    try {
        var link = stateNavigator.getNavigationLink(stateKey, navigationData);
    } catch {}
    var active = state && state.key === stateKey && LinkUtility.isActive(stateNavigator, navigationData);
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = LinkUtility.getOnClick(stateNavigator, props, link);
    LinkUtility.setActive(active, props, htmlProps);
    return <a {...htmlProps}>{children}</a>;
}

export default withStateNavigator(NavigationLink);
