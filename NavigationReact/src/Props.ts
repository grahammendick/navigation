import AsyncStateNavigator from './AsyncStateNavigator';
import { AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent } from 'react';

interface LinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    acrossCrumbs?: boolean;
    historyAction?: 'add' | 'replace' | 'none';
    navigating?: (e: MouseEvent<HTMLAnchorElement>, link: string) => boolean;
    defer?: boolean;
    stateNavigator?: AsyncStateNavigator;
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
