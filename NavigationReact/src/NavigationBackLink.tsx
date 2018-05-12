import LinkUtility from './LinkUtility';
import withStateNavigator from './withStateNavigator';
import { NavigationBackLinkProps } from './Props';
import * as React from 'react';

var NavigationBackLink = (props: NavigationBackLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { distance, stateNavigator, children } = props;
    try {
        var link = stateNavigator.getNavigationBackLink(distance);
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    return <a {...htmlProps}>{children}</a>;
}
export default withStateNavigator(NavigationBackLink);
