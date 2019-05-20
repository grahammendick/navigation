import AsyncStateNavigator from './AsyncStateNavigator';
import { AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent } from 'react';
import { FluentNavigator } from 'navigation';

interface LinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    historyAction?: 'add' | 'replace' | 'none';
    navigating?: (e: MouseEvent<HTMLAnchorElement>, link: string) => boolean;
    defer?: boolean;
    stateNavigator?: AsyncStateNavigator;
}

interface RefreshLinkProps extends LinkProps {
    navigationData?: any;
    includeCurrentData?: boolean;
    currentDataKeys?: string | string[];
    activeStyle?: any;
    activeCssClass?: string;
    disableActive?: boolean;
}

interface NavigationLinkProps extends RefreshLinkProps {
    stateKey: string;
}

interface NavigationBackLinkProps extends LinkProps {
    distance: number;
}

interface FluentLinkProps extends LinkProps {
    withContext?: boolean;
    navigate: (fluentNavigator: FluentNavigator) => FluentNavigator;
}

export { LinkProps, RefreshLinkProps, NavigationLinkProps, NavigationBackLinkProps, FluentLinkProps }
