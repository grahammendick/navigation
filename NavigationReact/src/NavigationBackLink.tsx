import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';

var NavigationBackLink = (props: NavigationBackLinkProps) => {
    var htmlProps: any = {};
    for(var key in props) {
        if (LinkUtility.isValidAttribute(key))
            htmlProps[key] = props[key];
    }
    var { distance, stateNavigator, children } = props;
    var { state } = stateNavigator.stateContext;
    try {
        var link = stateNavigator.getNavigationBackLink(distance);
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = LinkUtility.getOnClick(stateNavigator, props, link);
    return <a {...htmlProps}>{children}</a>;
}
export default withStateNavigator(NavigationBackLink);
