import { StateNavigator } from 'navigation';
import * as React from 'react';

export interface LinkProps extends React.HTMLProps<HTMLAnchorElement> {
    lazy?: boolean;
    historyAction?: string;
    navigating?: (e: MouseEvent, domId: string, link: string) => boolean;
    stateNavigator?: StateNavigator;
}

export interface RefreshLinkProps extends LinkProps {
    navigationData?: any;
    includeCurrentData?: boolean;
    currentDataKeys?: string;
    activeCssClass?: string;
    disableActive?: boolean;
}

export interface NavigationLinkProps extends RefreshLinkProps {
    stateKey: string;
}

export interface NavigationBackLinkProps extends RefreshLinkProps {
    distance: number;
}
