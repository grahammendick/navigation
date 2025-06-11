import { AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent, ReactNode } from 'react';
import AsyncStateNavigator from './AsyncStateNavigator';
import { FluentNavigator, StateContext } from 'navigation';

interface LinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    historyAction?: 'add' | 'replace' | 'none';
    navigating?: (e: MouseEvent<HTMLAnchorElement>, link: string) => boolean;
    stateNavigator?: AsyncStateNavigator;
    startTransition?: (transition: () => void) => void;
}

interface RefreshLinkProps extends LinkProps {
    navigationData?: any;
    includeCurrentData?: boolean;
    currentDataKeys?: string | string[];
    hash?: string;
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

interface SceneViewProps {
    active: string | string[] | ((stateContext: StateContext) => boolean);
    refetch: string[] | ((stateContext: StateContext) => boolean);
    name: string;
    errorFallback: ReactNode;
    children: any;
}

export { LinkProps, RefreshLinkProps, NavigationLinkProps, NavigationBackLinkProps, FluentLinkProps, SceneViewProps }
