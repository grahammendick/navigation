import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { RefreshLinkProps } from './Props';
import * as React from 'react';

var RefreshLink = (props: RefreshLinkProps) => {
    var htmlProps: any = {};
    for(var key in props) {
        if (LinkUtility.isValidAttribute(key))
            htmlProps[key] = props[key];
    }
    var { navigationData, includeCurrentData, currentDataKeys, stateNavigator, children } = props;
    navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
    try {
        var link = stateNavigator.getRefreshLink(navigationData);
    } catch {}
    var active = LinkUtility.isActive(stateNavigator, navigationData);
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    LinkUtility.setActive(active, props, htmlProps);
    return <a {...htmlProps}>{children}</a>;
}
export default withStateNavigator(RefreshLink);
