﻿'use client'
import React from 'react';
import LinkUtility from './LinkUtility.js';
import withStateNavigator from './withStateNavigator.js';
import { NavigationLinkProps } from './Props.js';

var NavigationLink = (props: NavigationLinkProps) => {
    var htmlProps = LinkUtility.toHtmlProps(props);
    var { stateKey, navigationData, includeCurrentData, currentDataKeys, hash, stateNavigator } = props;
    var { state } = stateNavigator.stateContext;
    navigationData = LinkUtility.getData(stateNavigator, navigationData, includeCurrentData, currentDataKeys);
    try {
        var link = stateNavigator.getNavigationLink(stateKey, navigationData, hash);
    } catch {}
    htmlProps.href = link && stateNavigator.historyManager.getHref(link);
    htmlProps.onClick = link && LinkUtility.getOnClick(stateNavigator, props, link);
    var active = state && state.key === stateKey && LinkUtility.isActive(stateNavigator, navigationData);
    LinkUtility.setActive(active, props, htmlProps);
    return <a {...htmlProps} />;
}
export default withStateNavigator(NavigationLink);
