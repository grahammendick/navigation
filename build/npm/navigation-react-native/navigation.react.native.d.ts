import { Component, Context, ReactNode } from 'react';
import { BackHandler, ImageRequireSource, ImageURISource, NativeSyntheticEvent, StyleProp, ViewStyle, TransformsStyle } from 'react-native';
import { Crumb, State, StateContext } from 'navigation';

declare global {
    interface Location {}
}

/**
 * Defines the Navigation Stack Props contract
 */
export interface NavigationStackProps {
    /**
     * A Scene's title
     */
    title?: (state: State, data: any) => string;
    /**
     * A Scene's to and from crumb trail style
     */
    crumbStyle?: (from: boolean, state: State, data: any, crumbs: Crumb[], nextState?: State, nextData?: any) => string;
    /**
     * A Scene's to and from unmount style
     */
    unmountStyle?: (from: boolean, state: State, data: any, crumbs: Crumb[]) => string;
    /**
     * Indicates whether a Scene should display the tab bar
     */
    hidesTabBar?: (state: State, data: any, crumbs: Crumb[]) => boolean;
    /**
     * A scene's shared element
     */
    sharedElement?: (state: State, data: any, crumbs: Crumb[]) => string;
    /**
     * Renders the scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
}

/**
 * Renders a stack of Scenes
 */
export class NavigationStack extends Component<NavigationStackProps> { }

/**
 * Defines the Navigation Bar Props contract
 */
export interface NavigationBarProps {
    /**
     * Indicates whether to hide the navigation bar
     */
    hidden?: boolean;
    /**
     * Indicates whether the title should be large
     */
    largeTitle?: boolean;
    /**
     * The title
     */
    title?: string;
    /**
     * The background color of the navigation bar
     */
    barTintColor?: string | ((standard: boolean) => string);
    /**
     * The color of foreground elements on the navigation bar
     */
    tintColor?: string | ((standard: boolean) => string);
    /**
     * The color of the title view
     */
    titleColor?: string;
    /**
     * The title for the back button
     */
    backTitle?: string;
    /**
     * The logo
     */
    logo?: ImageRequireSource | ImageURISource;
    /**
     * The menu overflow image
     */
    overflowImage?: ImageRequireSource | ImageURISource;
    /**
     * The navigation button image
     */
    navigationImage?: ImageRequireSource | ImageURISource;
    /**
     * The title font family
     */
    titleFontFamily?: string | ((standard: boolean) => string);
    /**
     * The title font weight
     */
    titleFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900' | ((standard: boolean) => 'normal' | 'bold'
        | '100' | '200' | '300' | '400' | '500'| '600' | '700' | '800' | '900');
    /**
     * The title font style
     */
    titleFontStyle?: 'normal' | 'italic' | ((standard: boolean) => 'normal' | 'italic');
    /**
     * The title font size
     */
    titleFontSize?: number | ((standard: boolean) => number);
    /**
     * The back button font family
     */
    backFontFamily?: string;
    /**
     * The back button font weight
     */
    backFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The back button font style
     */
    backFontStyle?: 'normal' | 'italic';
    /**
     * The back button font size
     */
    backFontSize?: number;
    /**
     * Indicates whether to render as a bottom app bar
     */
    bottomBar?: boolean;
    /**
     * The position of the anchored floating action button
     */
    fabAlignmentMode?: 'center' | 'end';
    /**
     * The animation that runs when the floating action button changes position
     */
    fabAnimationMode?: 'slide' | 'scale';
    /**
     * The cradle margin for the floating action button cutout
     */
    fabCradleMargin?: number;
    /**
     * The rounded corner radius for the floating action button cutout
     */
    fabCradleRoundedCornerRadius?: number;
    /**
     * The vertical offset for the floating action button cutout
     */
    fabCradleVerticalOffset?: number;
    /**
     * Indicates whether to hide the bottom navigation bar when scrolling
     */
    hideOnScroll?: boolean;
    /**
     * The id of the back button in end-to-end tests
     */
    backTestID?: string;
    /**
     * The id of the navigation button in end-to-end tests
     */
    navigationTestID?: string;
    /**
     * The id of the overflow button in end-to-end tests
     */
    overflowTestID?: string;
    /**
     * Handles navigation button press events
     */
    onNavigationPress?: () => void;
    /**
     * Handles offset change events
     */
    onOffsetChanged?: (e: NativeSyntheticEvent<{offset: number}>) => void;
}

/**
 * Controls the appearance of the UI navigation bar
 */
export class NavigationBar extends Component<NavigationBarProps> { }

/**
 * Defines the Left Bar Props contract
 */
export interface LeftBarProps {
    /**
     * Indicates whether bar buttons display in addition to the back button
     */
    supplementBack?: boolean;
}

    /**
 * Renders buttons in the left UI bar
 */
export class LeftBar extends Component<LeftBarProps> { }

/**
 * Renders buttons in the right UI bar
 */
export class RightBar extends Component { }

/**
 * Defines the Title Bar Props contract
 */
export interface TitleBarProps {
  /**
   * The style
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Renders titleView in the UI navigation bar
 */
export class TitleBar extends Component<TitleBarProps> {  }

/**
 * Defines the Bar Button Props contract
 */
export interface BarButtonProps {
    /**
     * The button title
     */
    title?: string;
    /**
     * The button image
     */
    image?: ImageRequireSource | ImageURISource;
    /**
     * The button system item
     */
    systemItem?: 'done' | 'cancel' | 'edit' | 'save' | 'add' | 'flexibleSpace'
        | 'fixedSpace' | 'compose' | 'reply' | 'action' | 'organize'
        | 'bookmarks' | 'search' | 'refresh' | 'stop' | 'camera'
        | 'trash' | 'play' | 'pause' | 'rewind' | 'fastForward';
    /**
     * Determines when this item should appear in the navigation bar
     */
    show?: 'ifRoom' | 'never' | 'always';
    /**
     * Indicates whether this item opens the search bar
     */
    search?: boolean;
    /**
     * The button font family
     */
    fontFamily?: string;
    /**
     * The button font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The button font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The button font size
     */
    fontSize?: number;
    /**
     * The id of the button in end-to-end tests
     */
    testID?: string;
    /**
     * Handles button press events
     */
    onPress?: () => void;
}

/**
 * Renders a button in the UI bar
 */
export class BarButton extends Component<BarButtonProps> { }

/**
 * Defines the Search Bar Props contract
 */
export interface SearchBarProps {
    /**
     * Indicates whether to to obscure the underlying content
     */
    obscureBackground?: boolean;
    /**
     * Indicates whether to hide the navigation bar
     */
    hideNavigationBar?: boolean;
    /**
     * Indicates whether to hide the search bar when scrolling
     */
    hideWhenScrolling?: boolean;
    /**
     * The auto-capitalization behavior
     */
    autoCapitalize?: 'none' | 'words' | 'sentences' | 'allCharacters';
    /**
     * Text displayed when search field is empty
     */
    placeholder?: string;
    /**
     * The search field text
     */
    text?: string;
    /**
     * The search field background color
     */
    barTintColor?: string;
    /**
     * Handles text change events
     */
    onChangeText?: (text: string) => void;
}

/**
 * Renders a serach bar in the UI navigation bar
 */
export class SearchBar extends Component<SearchBarProps> { }

/**
 * Defines the Coordinator Layout Props contract
 */
export interface CoordinatorLayoutProps {
    /**
     * The distance the scrolled content overlaps the navigation bar
     */
    overlap?: number;   
}

/**
 * Container that supports collapsing the navigation bar
 */
export class CoordinatorLayout extends Component<CoordinatorLayoutProps> {}

/**
 * Renders collapsing content inside the navigation bar
 */
export class CollapsingBar extends Component {}

/**
 * Defines the Action Bar Props contract
 */
export interface ActionBarProps {
    /**
     * Handles action bar expanded events
     */
    onExpanded?: () => void;
    /**
     * Handles action bar collapsed events
     */
    onCollapsed?: () => void;
}

/**
 * Renders an action bar in the UI navigation bar
 */
export class ActionBar extends Component<ActionBarProps> {}

/**
 * Defines the Status Bar Props contract
 */
export interface StatusBarProps {
    /**
     * Indicates whether to hide the status bar
     */
    hidden?: boolean;
    /**
     * The color of foreground elements on the status bar
     */
    tintStyle?: 'light' | 'dark';
    /**
     * The background color of the status bar
     */
    barTintColor?: string;
}

/**
 * Renders the status bar
 */
export class StatusBar extends Component<StatusBarProps> {}

/**
 * Defines the Shared Element Props contract
 */
export interface SharedElementProps {
    /**
     * The name shared across scenes by the two views
     */
    name: string;
    /**
     * The duration of the transition
     */
    duration?: number;
    /**
     * The fade mode used to swap the content of the two views
     */
    fadeMode?: 'in' | 'out' | 'cross' | 'through';
    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
}

/**
 * Shares its child UI element between scenes during navigation
 */
export class SharedElement extends Component<SharedElementProps> {}

/**
 * The context for overriding default hardware back handling
 */
export var BackHandlerContext: Context<BackHandler>;

/**
 * Defines the Tab Bar Item Props contract
 */
export interface TabBarItemProps {
    /**
     * The tab title
     */
    title?: string;
    /**
     * The tab badge value
     */
    badge?: string | number;
    /**
     * The tab badge background color
     */
    badgeColor?: string;
    /**
     * The tab image
     */
    image?: ImageRequireSource | ImageURISource | string;
    /**
     * The tab system item
     */
    systemItem?: 'bookmarks' | 'contacts' | 'downloads' | 'favorites'
        | 'featured' | 'history' | 'more' | 'most-recent' | 'most-viewed'
        | 'recents' | 'search' | 'top-rated';
    /**
     * The tab font family
     */
    fontFamily?: string;
    /**
     * The tab font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The tab font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The tab font size
     */
    fontSize?: number;
    /**
     * The id of the tab in end-to-end tests
     */
    testID?: string;
    /**
     * Handles button press events
     */
    onPress?: () => void;
}

/**
 * Renders a tab in the tab bar
 */
export class TabBarItem extends Component<TabBarItemProps> {}

/**
 * Defines the Tab Bar Props contract
 */
export interface TabBarProps {
    children: React.ReactElement<TabBarItem> | React.ReactElement<TabBarItem>[];
    /**
     * The background color of the tab bar
     */
    barTintColor?: string;
    /**
     * The color of the content within the tab bar
     */
    selectedTintColor?: string;
    /**
     * The color of unselected content wihtin the tab bar
     */
    unselectedTintColor?: string;
    /**
     * Indicates whether the tabs should be at the bottom
     */
    bottomTabs?: boolean;
    /**
     * Indicates whether the tab bar is for top level navigation
     */
    primary?: boolean;
    /**
     * Indicates whether the tab bar can be scrolled horizontally
     */
    scrollable?: boolean;
    /**
     * Indicates whether to scroll to the top when the tab is reselected
     */
    scrollsToTop?: boolean;
    /**
     * The default selected tab index
     */
    defaultTab?: number;
    /**
     * The selected tab index
     */
    tab?: number;
    /**
     * Handles tab change events
     */
    onChangeTab?: (tab: number) => void;
}

/**
 * Renders a tab bar
 */
export class TabBar extends Component<TabBarProps> {}

/**
 * Defines the Bottom Sheet Props contract
 */
export interface BottomSheetProps {
    /**
     * The height of the bottom sheet when it is collapsed
     */
    peekHeight?: number;
    /**
     * The height of the bottom sheet when it is expanded
     */
    expandedHeight?: number;
    /**
     * The top offset of the bottom sheet when it is expanded
     */
    expandedOffset?: number;
    /**
     * Determines the height of the bottom sheet when it is half expanded
     */
    halfExpandedRatio?: number;
    /**
     * Indicates whether the bottom sheet can hide when it is swiped down
     */
    hideable?: boolean;
    /**
     * Indicates whether swipe down hides the bottom sheet after it is expanded
     */
    skipCollapsed?: boolean;
    /**
     * Indicates whether the bottom sheet can be collapsed/expanded by dragging
     */
    draggable?: boolean;
    /**
     * The default resting state of the bottom sheet
     */
    defaultDetent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * The resting state of the bottom sheet
     */
    detent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * Handles the bottom sheet resting state change events
     */
    onChangeDetent?: (detent: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded') => void;
}

/**
 * Renders a bottom sheet
 */
export class BottomSheet extends Component<BottomSheetProps> {}

/**
 * Defines the Floating Action Button Props contract
 */
export interface FloatingActionButtonProps {
    /**
     * The floating action button image
     */
    image: ImageRequireSource | ImageURISource | string;
    /**
     * The floating action button text
     */
    text?: string;
    /**
     * The view the floating action button is anchored to
     */
    anchor?: number | null;
    /**
     * The layout position of the floating action button
     */
    gravity?: 'topLeft' | 'topStart' | 'top' | 'topRight' | 'topEnd'
        | 'left' | 'start' | 'center' | 'right' | 'end' | 'bottomLeft'
        | 'bottomStart' | 'bottom' | 'bottomRight' |  'bottomEnd';
    /**
     * The relative position of the floating action button within the anchor
     */
    anchorGravity?: 'topLeft' | 'topStart' | 'top' | 'topRight' | 'topEnd'
        | 'left' | 'start' | 'center' | 'right' | 'end' | 'bottomLeft'
        | 'bottomStart' | 'bottom' | 'bottomRight' |  'bottomEnd';
    /**
     * The size of the floating action button
     */
    size?: number;
    /**
     * The accessible description of the floating action button
     */
    contentDescription?: string;
    /**
     * The id of the floating action button in end-to-end tests
     */
    testID?: string;
     /**
     * The style
     */
    style?: StyleProp<FloatingActionButtonStyle>;
    /**
     * Handles floating action button press events
     */
    onPress?: () => void;
}

/**
 * Defines the Floating Action Button Style Prop contract
 */
export interface FloatingActionButtonStyle extends TransformsStyle {
    backgroundColor?: string;
    color?: string;
    margin?: number;
    marginBottom?: number;
    marginEnd?: number;
    marginHorizontal?: number;
    marginLeft?: number;
    marginRight?: number;
    marginStart?: number;
    marginTop?: number;
    opacity?: number;
    elevation?: number;
    fontFamily?: string;
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    fontStyle?: 'normal' | 'italic';
    fontSize?: number;
}

/**
 * Renders a floating action button
 */
export class FloatingActionButton extends Component<FloatingActionButtonProps> {}

/**
 * Defines the Modal Back Handler Props contract
 */
export interface ModalBackHandlerProps {
    children: (handleBack: () => boolean) => ReactNode;
}

/**
 * Handles the hardware back button inside a Modal
 */
export class ModalBackHandler extends Component<ModalBackHandlerProps> {}

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
