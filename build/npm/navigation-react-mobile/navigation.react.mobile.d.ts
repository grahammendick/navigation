import { State, HTML5HistoryManager } from 'navigation';
import { Component, ReactElement, ReactNode } from 'react';

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
     * The Shared Element Motion component
     */
    sharedElementMotion?: (props: SharedElementNavigationMotionProps) => ReactElement<SharedElementMotion>;
    /**
     * Renders the scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
    /**
     * Renders the Scene with the interpoated styles
     */
    children: (style: any, scene: ReactElement<any>, key: number, active: boolean, state: State, data: any) => ReactElement<any>;
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
    constructor(buildCurrentUrl: (url: string) => string, applicationPath?: string);
    /**
     * Gets a friendly Href from a Url
     */
    getHref(url: string): string;
    /**
     * Gets a Url from the anchor or location
     */
    getUrl(hrefElement: HTMLAnchorElement | Location): string;
    /**
     * Gets the current location from a friendly Href
     */
    getCurrentUrl(): string;
}
