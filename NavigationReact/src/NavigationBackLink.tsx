'use client'
import React from 'react';
import LinkUtility from './LinkUtility.js';
import withStateNavigator from './withStateNavigator.js';
import { NavigationBackLinkProps } from './Props.js';

var NavigationBackLink = (props: NavigationBackLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { distance, stateNavigator } = props;
    try {
        var link = stateNavigator.getNavigationBackLink(distance);
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    return <a {...htmlProps} />;
}
export default withStateNavigator(NavigationBackLink);
