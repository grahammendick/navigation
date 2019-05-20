import { State, StateNavigator, FluentNavigator } from 'navigation';
import { Component, Context, AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent } from 'react';

/**
 * Navigation event data
 */
export interface NavigationEvent {
    /**
     * The last State displayed before the current State
     */
    oldState: State;
    /**
     * The current State
     */
    state: State;
    /**
     * The NavigationData for the current State
     */
    data: any;
    /**
     * The current asynchronous data
     */
    asyncData: any;
    /**
     * State navigator for the current context
     */
    stateNavigator: StateNavigator;
}

/**
 * The context for providers and consumers of navigation event data
 */
export var NavigationContext: Context<NavigationEvent>;

/**
 * Provides the navigation event data
 */
export class NavigationHandler extends Component<{ stateNavigator: StateNavigator }> { }

/**
 * Defines the Link Props contract
 */
export interface LinkProps extends DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    /**
     * Determines the effect on browser history
     */
    historyAction?: 'add' | 'replace' | 'none';
    /**
     * Handles Link click events
     */
    navigating?(e: MouseEvent<HTMLAnchorElement>, link: string): boolean;
}

/**
 * Defines the Refresh Link Props contract
 */
export interface RefreshLinkProps extends LinkProps {
    /**
     * The NavigationData to pass
     */
    navigationData?: any;
    /**
     * Indicates whether to include all the current NavigationData
     */
    includeCurrentData?: boolean;
    /**
     * The data to add from the current NavigationData
     */
    currentDataKeys?: string | string[];
    /**
     * The style to display when the Link is active
     */
    activeStyle?: any;
    /**
     * The Css Class to display when the Link is active
     */
    activeCssClass?: string;
    /**
     * Indicates whether the Link is disabled when active
     */
    disableActive?: boolean;
}

/**
 * Hyperlink Component that navigates to the current State
 */
export class RefreshLink extends Component<RefreshLinkProps> { }

/**
 * Defines the Navigation Link Props contract
 */
export interface NavigationLinkProps extends RefreshLinkProps {
    /**
     * The key of the State to navigate to
     */
    stateKey: string;
}

/**
 * Hyperlink Component that navigates to a State
 */
export class NavigationLink extends Component<NavigationLinkProps> { }

/**
 * Defines the Navigation Back Link Props contract
 */
export interface NavigationBackLinkProps extends LinkProps {
    /**
     * Starting at 1, The number of Crumb steps to go back
     */
    distance: number;
}

/**
 * Hyperlink Component that navigates back along the crumb trail
 */
export class NavigationBackLink extends Component<NavigationBackLinkProps> { }

/**
 * Defines the Fluent Link Props contract
 */
export interface FluentLinkProps extends LinkProps {
    /**
     * Indicates whether to inherit the current context
     */
    withContext?: boolean;
    /**
     * The function that fluently navigates to a State
     */
    navigate: (fluentNavigator: FluentNavigator) => FluentNavigator;
}

/**
 * Hyperlink Component that fluently navigates to a State
 */
export class FluentLink extends Component<FluentLinkProps> { }
