import { StateNavigator } from 'navigation';
import { HTMLProps, MouseEvent } from 'react';

interface LinkProps extends HTMLProps<HTMLAnchorElement> {
    acrossCrumbs?: boolean;
    historyAction?: 'add' | 'replace' | 'none';
    navigating?: (e: MouseEvent<HTMLAnchorElement>, link: string) => boolean;
    stateNavigator?: StateNavigator;
}

interface RefreshLinkProps extends LinkProps {
    navigationData?: any;
    includeCurrentData?: boolean;
    currentDataKeys?: string;
    activeCssClass?: string;
    disableActive?: boolean;
}

interface NavigationLinkProps extends RefreshLinkProps {
    stateKey: string;
}

interface NavigationBackLinkProps extends LinkProps {
    distance: number;
}

export { LinkProps, RefreshLinkProps, NavigationLinkProps, NavigationBackLinkProps }
