import { State, StateNavigator, FluentNavigator } from 'navigation';
import { Component, Context, AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent } from 'react';

/**
 * Navigation event data
 */
export interface NavigationEvent<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string> {
    /**
     * The last State displayed before the current State
     */
    oldState: State;
    /**
     * The current State
     */
    state: State<Key & string, Key extends keyof NavigationInfo ? NavigationInfo[Key] : any>;
    /**
     * The NavigationData for the current State
     */
    data: Key extends keyof NavigationInfo ? NavigationInfo[Key] : any;
    /**
     * The current asynchronous data
     */
    asyncData: any;
    /**
     * State navigator for the current context
     */
    stateNavigator: StateNavigator<NavigationInfo, Key>;
}

/**
 * The context for providers and consumers of navigation event data
 */
export var NavigationContext: Context<NavigationEvent<any, any>> & Context<NavigationEvent<any, string>>;

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
export interface RefreshLinkProps<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string> extends LinkProps {
    /**
     * The NavigationData to pass
     */
    navigationData?: Key extends keyof NavigationInfo ? NavigationInfo[Key] : any;
    /**
     * Indicates whether to include all the current NavigationData
     */
    includeCurrentData?: boolean;
    /**
     * The data to add from the current NavigationData
     */
    currentDataKeys?: string & (Key extends keyof NavigationInfo ? keyof NavigationInfo[Key] : any) | (string & (Key extends keyof NavigationInfo ? keyof NavigationInfo[Key] : any))[];
    /**
     * The fragment identifier
     */
     hash?: string;
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
export class RefreshLink<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string> extends Component<RefreshLinkProps<NavigationInfo, Key>> { }

/**
 * Defines the Navigation Link Props contract
 */
export interface NavigationLinkProps<NavigationInfo extends { [index: string]: any } = any, StateKey extends keyof NavigationInfo = string> extends RefreshLinkProps<NavigationInfo, StateKey> {
    /**
     * The key of the State to navigate to
     */
    stateKey: StateKey & keyof NavigationInfo;
}

/**
 * Hyperlink Component that navigates to a State
 */
export class NavigationLink<NavigationInfo extends { [index: string]: any } = any, StateKey extends keyof NavigationInfo = string> extends Component<NavigationLinkProps<NavigationInfo, StateKey>> { }

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
export interface FluentLinkProps<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string> extends LinkProps {
    /**
     * Indicates whether to inherit the current context
     */
    withContext?: boolean;
    /**
     * The function that fluently navigates to a State
     */
    navigate: (fluentNavigator: FluentNavigator<NavigationInfo, Key>) => FluentNavigator<NavigationInfo>;
}

/**
 * Hyperlink Component that fluently navigates to a State
 */
export class FluentLink<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string> extends Component<FluentLinkProps<NavigationInfo, Key>> { }
