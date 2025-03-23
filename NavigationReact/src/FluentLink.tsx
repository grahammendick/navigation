'use client'
import React from 'react';
import LinkUtility from './LinkUtility.js';
import withStateNavigator from './withStateNavigator.js';
import { FluentLinkProps } from './Props.js';

var FluentLink = (props: FluentLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { withContext = false, navigate, stateNavigator } = props;
    try {
        var link = navigate(stateNavigator.fluent(withContext)).url;
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    return <a {...htmlProps} />;
}
export default withStateNavigator(FluentLink);
