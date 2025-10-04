import { Component, Context, ReactNode, ReactElement } from 'react';
import { BackHandler, ImageRequireSource, ImageURISource, NativeSyntheticEvent, StyleProp, ViewStyle, TransformsStyle, ColorValue } from 'react-native';
import { Crumb, State, StateContext } from 'navigation';
import { SFSymbolURISource } from './sf-symbol';

declare global {
    interface Location {}
}

type TranslateAnimation = {
    type: 'translate',
    duration?: number,
    fromX?: number | string,
    toX?: number | string,
    startX?: number | string,
    fromY?: number | string,
    toY?: number | string,
    startY?: number | string,
};

type ScaleAnimation = {
    type: 'scale',
    duration?: number,
    fromX?: number | string,
    toX?: number | string,
    startX?: number | string,
    fromY?: number | string,
    toY?: number | string,
    startY?: number | string,
    pivotX?: number | string,
    pivotY?: number | string
};

type AlphaAnimation = {
    type: 'alpha',
    duration?: number,
    from?: number,
    to?: number,
    start?: number,
};

type RotateAnimation = {
    type: 'rotate',
    duration?: number,
    from?: number,
    to?: number,
    start?: number,
    pivotX?: number | string,
    pivotY?: number | string
};

type Animation = TranslateAnimation | ScaleAnimation | AlphaAnimation | RotateAnimation;

type Transition = { type: 'sharedAxis', axis?: 'x' | 'y' | 'z' } | { type: 'elevationScale' | 'fade' | 'fadeThrough' | 'hold' } | Animation | Animation[] | { duration?: number, items: Animation[] };

/**
 * Defines the Navigation Stack Props contract
 */
export interface NavigationStackProps {
    /**
     * The link to navigate to when Scenes in the stack are unregistered
     */
    stackInvalidatedLink?: string;
    /**
     * Indicates whether custom enter and exit animations should run
     */
    customAnimation?: boolean;
     /**
     * The Scene's title
     */
    title?: (state: State, data: any) => string;
    /**
     * The Scene's to and from crumb trail style
     * @platform android
     */
    crumbStyle?: ((from: boolean, state: State, data: any, crumbs: Crumb[], nextState?: State, nextData?: any) => string | Transition) | Transition;
    /**
     * The Scene's to and from unmount style
     */
    unmountStyle?: ((from: boolean, state: State, data: any, crumbs: Crumb[]) => string | Transition) | Transition;
    /**
     * Indicates whether the Scene should display the tab bar
     * @platform ios
     */
    hidesTabBar?: (state: State, data: any, crumbs: Crumb[]) => boolean;
    /**
     * The Scene's shared element
     */
    sharedElement?: (state: State, data: any, crumbs: Crumb[]) => string;
    /**
     * The Scene's shared elements
     */
    sharedElements?: (state: State, data: any, crumbs: Crumb[]) => string | string[];
    /**
     * The color of the Scene's background
     */
    backgroundColor?: (state: State, data: any, crumbs: Crumb[]) => ColorValue;
    /**
     * The color of the background behind the Scenes
     */
    underlayColor?: ColorValue | ((state: State, data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * The Scene's orientation
     * @platform android
     */
    landscape?: (state: State, data: any, crumbs: Crumb[]) => boolean;
    /**
     * Renders the Scene for the State and data
     */
    renderScene?: (state: State, data: any) => ReactNode;
    /**
     * The Scenes
     */
    children?: any;
}

/**
 * Renders a stack of Scenes
 */
export class NavigationStack extends Component<NavigationStackProps> { }

/**
 * Defines the Scene Props contract
 */
 export interface SceneProps<NavigationInfo extends { [index: string]: any } = any> {
    /**
     * The key of the corresponding State
     */
    stateKey: keyof NavigationInfo & string;
    /**
     * A Scene's to and from crumb trail style
     * @platform android
     */
    crumbStyle?: ((from: boolean, data: any, crumbs: Crumb[], nextState?: State, nextData?: any) => string | Transition) | Transition;
    /**
     * A Scene's to and from unmount style
     */
    unmountStyle?: ((from: boolean, data: any, crumbs: Crumb[]) => string | Transition) | Transition;
    /**
     * Indicates whether a Scene should display the tab bar
     * @platform ios
     */
    hidesTabBar?: boolean | ((data: any, crumbs: Crumb[]) => boolean);
    /**
     * A Scene's shared element
     */
    sharedElement?: string | ((data: any, crumbs: Crumb[]) => string);
    /**
     * A Scene's shared elements
     */
    sharedElements?: string | string[] | ((data: any, crumbs: Crumb[]) => string | string[]);
    /**
     * The color of a Scene's background
     */
    backgroundColor?: ColorValue | ((data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * The color of the background behind the Scene
     */
    underlayColor?: ColorValue | ((data: any, crumbs: Crumb[]) => ColorValue);
    /**
     * A Scene's orientation
     * @platform android
     */
    landscape?: boolean | ((data: any, crumbs: Crumb[]) => boolean);
     /**
     * The Scene content
     */
    children: ReactNode;
}

/**
 * Configures the Scene for a State
 */
export class Scene<NavigationInfo extends { [index: string]: any } = any> extends Component<SceneProps<NavigationInfo>> {}

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
    barTintColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * The color of foreground elements on the navigation bar
     */
    tintColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * The shadow color of the navigation bar
     */
    shadowColor?: ColorValue;
    /**
     * The color of the title view
     */
    titleColor?: ColorValue | ((standard: boolean) => ColorValue);
    /**
     * Indicates whether to center the title within the navigation bar
     * @platform android
     */
    titleCentered?: boolean;
    /**
     * The title for the back button
     * @platform ios
     */
    backTitle?: string;
    /**
     * The back button image
     * @platform ios
     */
    backImage?: ImageRequireSource | ImageURISource | SFSymbolURISource;
    /**
     * The logo
     * @platform android
     */
    logo?: ImageRequireSource | ImageURISource;
    /**
     * The menu overflow image
     * @platform android
     */
    overflowImage?: ImageRequireSource | ImageURISource;
    /**
     * The navigation button image
     * @platform android
     */
    navigationImage?: ImageRequireSource | ImageURISource;
    /**
     * The accessible description of the navigation button
     * @platform android
     */
    navigationAccessibilityLabel?: string;
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
     * @platform ios
     */
    backFontFamily?: string;
    /**
     * The back button font weight
     * @platform ios
     */
    backFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The back button font style
     * @platform ios
     */
    backFontStyle?: 'normal' | 'italic';
    /**
     * The back button font size
     * @platform ios
     */
    backFontSize?: number;
    /**
     * Indicates whether to render as a bottom app bar
     * @platform android
     */
    bottomBar?: boolean;
    /**
     * The position of the anchored floating action button
     * @platform android
     */
    fabAlignmentMode?: 'center' | 'end';
    /**
     * The animation that runs when the floating action button changes position
     * @platform android
     */
    fabAnimationMode?: 'slide' | 'scale';
    /**
     * The cradle margin for the floating action button cutout
     * @platform android
     */
    fabCradleMargin?: number;
    /**
     * The rounded corner radius for the floating action button cutout
     * @platform android
     */
    fabCradleRoundedCornerRadius?: number;
    /**
     * The vertical offset for the floating action button cutout
     * @platform android
     */
    fabCradleVerticalOffset?: number;
    /**
     * Indicates whether to hide the bottom navigation bar when scrolling
     * @platform android
     */
    hideOnScroll?: boolean;
    /**
     * The id of the back button in end-to-end tests
     * @platform ios
     */
    backTestID?: string;
    /**
     * The id of the navigation button in end-to-end tests
     * @platform android
     */
    navigationTestID?: string;
    /**
     * The id of the overflow button in end-to-end tests
     * @platform android
     */
    overflowTestID?: string;
    /**
     * Handles navigation button press events
     * @platform android
     */
    onNavigationPress?: () => void;
    /**
     * Handles offset change events
     * @platform android
     */
    onOffsetChanged?: (e: NativeSyntheticEvent<{offset: number}>) => void;
    /**
     * The navigation bar content
     */
    children?: ReactNode;
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
     * @platform ios
     */
    supplementBack?: boolean;
    /**
     * The buttons
     */
    children: ReactNode;
}

/**
 * Renders buttons in the left UI bar
 */
export class LeftBar extends Component<LeftBarProps> { }

/**
 * Defines the Right Bar Props contract
 */
export interface RightBarProps {
    /**
     * The buttons
     */
    children: ReactNode;
}

/**
 * Renders buttons in the right UI bar
 */
export class RightBar extends Component<RightBarProps> { }

/**
 * Defines the Title Bar Props contract
 */
export interface TitleBarProps {
    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * The title view
     */
    children: ReactNode;
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
    image?: ImageRequireSource | ImageURISource | SFSymbolURISource;
    /**
     * The button system item
     * @platform ios
     */
    systemItem?: 'done' | 'cancel' | 'edit' | 'save' | 'add' | 'flexibleSpace'
        | 'fixedSpace' | 'compose' | 'reply' | 'action' | 'organize'
        | 'bookmarks' | 'search' | 'refresh' | 'stop' | 'camera'
        | 'trash' | 'play' | 'pause' | 'rewind' | 'fastForward';
    /**
     * Determines when this item should appear in the navigation bar
     * @platform android
     */
    show?: 'ifRoom' | 'never' | 'always';
    /**
     * Indicates whether this item opens the search bar
     * @platform android
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
     * The button title and image color
     */
    tintColor?: ColorValue;
    /**
     * The Sheet's shared element
     * @platform ios
     */    
    sharedElement?: string;
    /**
     * The id of the button in end-to-end tests
     */
    testID?: string;
    /**
     * The custom view size
     * @platform android
     */
    size?: number;
    /**
     * The button view
     */
    children?: ReactNode;
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
     * Indicates whether the search bar takes over the toolbar
     * @platform android
     */
    toolbar?: boolean;
    /**
     * Indicates whether the search is active
     */
    active?: boolean;
    /**
     * Indicates whether to to obscure the underlying content
     * @platform ios
     */
    obscureBackground?: boolean;
    /**
     * Indicates whether to hide the navigation bar
     * @platform ios
     */
    hideNavigationBar?: boolean;
    /**
     * Indicates whether to hide the search bar when scrolling
     * @platform ios
     */
    hideWhenScrolling?: boolean;
    /**
     * The auto-capitalization behavior
     */
    autoCapitalize?: 'none' | 'words' | 'sentences' | 'allCharacters';
    /**
     * Text displayed when search field is empty
     */
    placeholder?: string | ((toolbar: boolean) => string);
    /**
     * The search field text
     */
    text?: string;
    /**
     * The search field font family
     */
    fontFamily?: string;
    /**
     * The search field font weight
     */
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500'
        | '600' | '700' | '800' | '900';
    /**
     * The search field font style
     */
    fontStyle?: 'normal' | 'italic';
    /**
     * The search field font size
     */
    fontSize?: number;
    /**
     * The search field background color
     */
    barTintColor?: ColorValue | ((toolbar: boolean) => ColorValue);
    /**
     * The selected scope button
     * @platform ios
     */
    scopeButton?: string;
    /**
     * The scope button titles
     * @platform ios
     */
    scopeButtons?: string[];
    /**
     * The search results
     */
    children: ReactNode;
    /**
     * Handles text change events
     */
    onChangeText?: (text: string) => void;
    /**
     * Handles search press events
     */
    onQuery?: (text: string) => void;
    /**
     * Handles active change events
     */
    onChangeActive?: (active: boolean) => void;
    /**
     * Handles scope button change events
     * @platform ios
     */
    onChangeScopeButton?: (scopeButton: string) => void;
}

/**
 * Renders a search bar in the UI navigation bar
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
    /**
     * The layout content
     */
    children: ReactNode;
}

/**
 * Container that supports collapsing the navigation bar
 * @platform android
 */
export class CoordinatorLayout extends Component<CoordinatorLayoutProps> {}

/**
 * Defines the Collapsing Bar Props contract
 */
export interface CollapsingBarProps {
    /**
     * Indicates the effect used to collapse and expand the title
     */
    titleCollapseMode?: 'fade' | 'scale';
    /**
     * The collapsing bar content
     */
    children?: ReactNode;
}

/**
 * Renders collapsing content inside the navigation bar
 * @platform android
 */
export class CollapsingBar extends Component<CollapsingBarProps> {}

/**
 * Defines the Action Bar Props contract
 */
export interface ActionBarProps {
    /**
     * The action view
     */
    children: ReactNode;
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
 * @platform android
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
     * @platform android
     */
    barTintColor?: ColorValue;
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
     * The name shared across Scenes by the two elements
     */
    name: string;
    /**
     * The duration of the transition
     */
    duration?: number;
    /**
     * The fade mode used to swap the content of the two elements
     */
    fadeMode?: 'in' | 'out' | 'cross' | 'through';
    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
    /**
     * The shared content
     */
    children: ReactNode;
}

/**
 * Shares its child UI element between scenes during navigation
 */
export class SharedElement extends Component<SharedElementProps> {}

/**
 * The context for overriding default hardware back handling
 * @platform android
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
    badgeColor?: ColorValue;
    /**
     * The tab image
     */
    image?: ImageRequireSource | ImageURISource | SFSymbolURISource | string;
    /**
     * The tab system item
     * @platform ios
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
     * The tab content
     */
    children: ReactNode;
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
 * The context for freezing unvisited tabs
 */
 export var TabBarItemContext: Context<{ onLoad: () => void; }>;

/**
 * Defines the Tab Bar Props contract
 */
export interface TabBarProps {
    /**
     * The background color of the tab bar
     */
    barTintColor?: ColorValue;
    /**
     * The color of the selected content within the tab bar
     */
    selectedTintColor?: ColorValue;
    /**
     * The color of unselected content within the tab bar
     */
    unselectedTintColor?: ColorValue;
    /**
     * The color of the active indicator within the tab bar
     * @platform android
     */
    activeIndicatorColor?: ColorValue;
    /**
     * The ripple color of the tab bar
     * @platform android
     */
    rippleColor?: ColorValue;
    /**
     * The shadow color of the tab bar
     */
    shadowColor?: ColorValue;
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
     * @platform android
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
     * Indicates how labels should be displayed in the tab bar
     * @platform android
     */
    labelVisibilityMode?: 'auto' | 'labeled' | 'unlabeled' | 'selected';
    /**
     * The selected tab index
     */
    tab?: number;
    /**
     * Indicates whether to prevent a flash of unstyled content. After a theme
     * change set to true to avoid the flash and set back to false onChangeTab
     */
    preventFouc?: boolean;
    /**
     * The tabs
     */
    children: ReactElement<TabBarItem> | ReactElement<TabBarItem>[];
    /**
     * Handles tab change events
     */
    onChangeTab?: (tab: number) => void;
    /**
     * Handles back button press events
     * @platform android
     */
    onPressBack?: () => boolean;
}

/**
 * Renders a tab bar
 */
export class TabBar extends Component<TabBarProps> {}

/**
 * Defines the Sheet Props contract
 */
export interface SheetProps {
    /**
     * Indicates whether the sheet disables the scene behind
     */
    modal?: boolean;
    /**
     * Indicates whether the sheet is a bottom sheet
     */
    bottom?: boolean;
    /**
     * The height of the sheet when it is collapsed
     */
    peekHeight?: number;
    /**
     * The height of the sheet when it is expanded
     */
    expandedHeight?: number;
    /**
     * The top offset of the sheet when it is expanded
     */
    expandedOffset?: number;
    /**
     * Determines the height of the sheet when it is half expanded
     */
    halfExpandedRatio?: number;
    /**
     * Indicates whether the sheet can hide when it is swiped down
     */
    hideable?: boolean;
    /**
     * Indicates whether swipe down hides the sheet after it is expanded
     */
    skipCollapsed?: boolean;
    /**
     * Indicates whether the sheet can be collapsed/expanded by dragging
     */
    draggable?: boolean;
    /**
     * The default resting state of the sheet
     */
    defaultDetent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * The resting state of the sheet
     */
    detent?: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded';
    /**
     * The Sheet's shared element
     * @platform ios
     */
    sharedElement?: string;
    /**
     * The sheet content
     */
    children: ReactNode;
    /**
     * Handles the sheet resting state change events
     */
    onChangeDetent?: (detent: 'hidden' | 'collapsed' | 'halfExpanded' | 'expanded') => void;
}

/**
 * Renders a sheet
 */
export class Sheet extends Component<SheetProps> {}

/**
 * Renders a bottom sheet
 */
export class BottomSheet extends Component<Omit<SheetProps, 'bottom'>> {}

/**
 * Defines the Drawer Props contract
 */
export interface DrawerProps {
    /**
     * The drawer content
     */
    view: ReactNode;
    /**
     * Indicates whether the drawer is open
     */
    open?: boolean;
    /**
     * Indicates whether the drawer opens from the right
     */
    fromRight?: boolean;

    /**
     * The scene content
     */
    children: ReactNode;
    /**
     * Handles drawer open change events
     */
    onChangeOpen?: (open: boolean) => void;
    /**
     * Handles drawer open events
     */
    onOpen?: () => void;
    /**
     * Handles drawer close events
     */
    onClose?: () => void;
}

/**
 * Renders a drawer
 * @platform android
 */
export class Drawer extends Component<DrawerProps> {}

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
    anchor?: number | null | 'navigationBar' | 'bottomNavigationBar' | 'bottomSheet';
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
     * The ripple color of the floating action button
     */
    rippleColor?: ColorValue;
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
    backgroundColor?: ColorValue;
    color?: ColorValue;
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
 * @platform android
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
 * @platform android
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
