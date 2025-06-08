import { State, StateNavigator, FluentNavigator, StateContext } from 'navigation';
import { Component, Context, AnchorHTMLAttributes, DetailedHTMLProps, MouseEvent, ReactNode, ComponentType } from 'react';

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
 * The RSC bundler context
 */
export var BundlerContext: Context<{
    /**
     * Streams RSC
     */
    deserialize: (url: string, options: any) => Promise<any>;
    /**
     * Updates the root RSC content
     */
    setRoot: (root: any) => void;
}>;

/**
 * The hook that provides the current navigation event data
 */
export function useNavigationEvent<NavigationInfo extends { [index: string]: any } = any, Key extends keyof NavigationInfo = string>() : NavigationEvent<NavigationInfo, Key>;

/**
 * The hook that determines when to refetch the RSC View
 */
export function useRefetch(refetch?: string[] | ((stateContext: StateContext) => boolean)) : void;

/**
 * Defines the Navigation Handler Props contract
 */
export interface NavigationHandlerProps {
    /**
     * The state navigator that triggers navigation events
     */
    stateNavigator: StateNavigator;
    /**
     * The rendered content
     */
    children: ReactNode;
}

/**
 * Provides the navigation event data
 */
export class NavigationHandler extends Component<NavigationHandlerProps> { }

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
    /**
     * React function that enables concurrent rendering when navigating
     */
    startTransition?: (transition: () => void) => void;
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

/**
 * Defines the Scene View Props contract
 */
export interface SceneViewProps<NavigationInfo extends { [index: string]: any } = any> {
    /**
     * A function or the State key(s) that activate the View
     */
    active: (keyof NavigationInfo & string) | (keyof NavigationInfo & string)[] | ((stateContext: StateContext) => boolean);
    /**
     * The name identifying the View when fetching RSC
     */
    name?: string;
    /**
     * A function or the data keys that determine when to refetch the RSC View
     */
    refetch?: string[];
    /**
     * The content to show when the View errors
     */
    errorFallback?: ReactNode | ComponentType;
    /**
     * The View
     */
    children: ReactNode;
}

/**
 * View that shows when the State is active
 */
export class SceneView<NavigationInfo extends { [index: string]: any } = any> extends Component<SceneViewProps<NavigationInfo>> {}
