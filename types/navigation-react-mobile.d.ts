import { Crumb, State, StateContext, HTML5HistoryManager } from 'navigation';
import { Component, ReactElement, ReactNode, ComponentType } from 'react';

/**
 * Defines the Shared Element Props contract
 */
export interface SharedElementProps {
    /**
     * The Shared Element identifier
     */
    name: string;
    /**
     * The Shared Element data
     */
    data?: any;
    /**
     * Indicates whether to disable the sharing
     */
    unshare?: boolean;
    /**
     * The HTML Element to share
     */
    children: ReactElement<any>;
}

/**
 * Holds Shared Elements and their data
 */
export interface SharedItem {
    /**
     * The Shared Element identifier
     */
    name: string;
    /**
     * The from HTML Element and data
     */
    oldElement: {ref: HTMLElement; data: any};
    /**
     * The to HTML Element and data
     */
    mountedElement: {ref: HTMLElement; data: any};
}

/**
 * Defines the Shared Element Navigation Motion Props contract
 */
export interface SharedElementNavigationMotionProps {
    /**
     * The Shared Elements
     */
    sharedElements: SharedItem[];
    /**
     * The animation's initial progress
     */
    progress: number;
    /**
     * The animation duration
     */
    duration: number;
}

/**
 * Defines the Shared Element Motion Props contract
 */
export interface SharedElementMotionProps {
    /**
     * Styles the HTML Element when the sharing begins
     */
    onAnimating?: (name: string, ref: HTMLElement, data: any) => void;
    /**
     * Styles the HTML Element when the sharing ends
     */
    onAnimated?: (name: string, ref: HTMLElement, data: any) => void;
    /**
     * Turns the Shared Element data into styles
     */
    elementStyle?: (name: string, ref: HTMLElement, data: any) => any;
    /**
     * Renders the Shared Element with the interpoated styles
     */
    children: (style: any, name: string, oldElementData: any, mountedElementData: any) => ReactElement<any>;
}

/**
 * Defines the Navigation Motion Props contract
 */
export interface NavigationMotionProps {
    /**
     * A Scene's unmounted style
     */
    unmountedStyle?: any;
    /**
     * A Scene's mounted style
     */
    mountedStyle?: any;
    /**
     * A Scene's crumb trail style
     */
    crumbStyle?: any;
    /**
     * The animation duration
     */
    duration?: number;
    /**
     * The link to navigate to when Scenes in the stack are unregistered
     */
    stackInvalidatedLink?: string;
    /**
     * The Scenes or a callback that renders the Scenes
     */
    children?: any;
    /**
     * The Shared Element Motion component
     */
    sharedElementMotion?: (props: SharedElementNavigationMotionProps) => ReactElement<SharedElementMotion>;
    /**
     * Renders the Scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
    /**
     * Renders the Scene with the interpoated styles
     */
    renderMotion?: (style: any, scene: ReactElement<any>, key: string, active: boolean, state: State, data: any) => ReactElement<any>;
}

/**
 * Defines the Navigation Stack Props contract
 */
export interface NavigationStackProps {
    /**
     * A Scene's unmount animation
     */
    unmountStyle?: any;
    /**
     * A Scene's crumb trail animation
     */
    crumbStyle?: any;
    /**
     * The animation duration
     */
    duration?: number;
    /**
     * The link to navigate to when Scenes in the stack are unregistered
     */
    stackInvalidatedLink?: string;
    /**
     * A Scene's class name
     */
    className?: any;
    /**
     * A Scene's style
     */
    style?: any;
    /**
     * The Scenes
     */
    children?: any;
    /**
     * A Scene's shared elements 
     */
    sharedElements?: string[] | ((state: State, data: any, crumbs: Crumb[]) => string[]);
    /**
     * Renders the Scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
}

/**
 * Defines the Scene Props contract
 */
 export interface SceneProps<NavigationInfo extends { [index: string]: any } = any> {
    /**
     * The key of the corresponding State
     */
    stateKey: keyof NavigationInfo & string;
    /**
     * The NavigationData keys that determine when to refetch the RSC Scene
     */
    dataKeyDeps?: string[];
    /**
     * The content to show when the Scene errors
     */
    errorFallback?: ReactNode | ComponentType;
    /**
     * The Scene's unmounted style
     */
    unmountedStyle?: any;
    /**
     * The Scene's unmount animation
     */
    unmountStyle?: any;
    /**
     * The Scene's mounted style
     */
    mountedStyle?: any;
    /**
     * The Scene's crumb trail style or animation
     */
    crumbStyle?: any;
    /**
     * The Scene's class name
     */
    className?: any;
    /**
     * The Scene's style
     */
    style?: any;
    /**
     * The Scene's shared elements
     */
    sharedElements?: string[] | ((data: any, crumbs: Crumb[]) => string[]);
     /**
     * The Scene content
     */
    children: ReactNode;
}

/**
 * Identifies HTML Elements that can be shared when navigating
 */
export class SharedElement extends Component<SharedElementProps> { }

/**
 * Animates Shared Elements when navigating
 */
export class SharedElementMotion extends Component<SharedElementNavigationMotionProps & SharedElementMotionProps> { }

/**
 * Animates Scenes when navigating
 */
export class NavigationMotion extends Component<NavigationMotionProps> { }

/**
 * Renders a stack of Scenes and animates them when navigating
 */
export class NavigationStack extends Component<NavigationStackProps> { }

/**
 * Configures the Scene for a State
 */
 export class Scene<NavigationInfo extends { [index: string]: any } = any> extends Component<SceneProps<NavigationInfo>> {}

/**
 * Manages history with the HTML5 history api. Produces friendly Urls in Mobile
 * web apps. If the applicationPath is undefined it uses the browser's Url hash
 */
export class MobileHistoryManager extends HTML5HistoryManager {
    /**
     * Initializes a new instance of the MobileHistoryManager class
     * @param buildCurrentUrl The function that adds an initial crumb trail to
     * a friendly Url
     * @param applicationPath The application path
     */
    constructor(buildCurrentUrl?: ((url: string) => string) | null, applicationPath?: string);
}

/**
 * Registers callback for when navigating back to this Scene from another
 * @param handler The navigating event handler
 */
export function useNavigating(handler: (data: any, url: string, history: boolean, currentContext: StateContext) => void) : void;

/**
 * Registers callback for when another Scene has navigated to this Scene
 * @param handler The navigated event handler
 */
export function useNavigated(handler: () => void) : void;

/**
 * Registers callback for when this Scene navigates to another Scene
 * @param handler The unloading event handler
 */
export function useUnloading(handler: (state: State, data: any, url: string, history: boolean, crumbs: Crumb[]) => boolean) : void;

/**
 * Registers callback for when this Scene has navigated to another Scene
 * @param handler The unloaded event handler
 */
export function useUnloaded(handler: (state: State, data: any, stateContext: StateContext) => void) : void;
