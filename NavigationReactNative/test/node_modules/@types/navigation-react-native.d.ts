import { Component, ReactNode } from 'react';
import { ImageURISource, StyleProp, ViewStyle } from 'react-native';
import { StateNavigator, State } from 'navigation';

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
    crumbStyle?: (from: boolean, state: State, data: any, nextState?: State, nextData?: any) => string;
    /**
     * A Scene's to and from unmount style
     */
    unmountStyle?: (from: boolean, state: State, data: any, nextState?: State, nextData?: any) => string;
    /**
     * A scene's shared elements
     */
    sharedElements?: (state: State, data: any) => string[];
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
 * Renders buttons in the left UI bar
 */
export class LeftBarIOS extends Component { }

/**
 * Renders buttons in the right UI bar
 */
export class RightBarIOS extends Component { }

/**
 * Defines the Bar Button Props contract
 */
export interface BarButtonIOSProps {
    /**
     * The button title
     */
    title?: string;
    /**
     * The button image
     */
    image?: ImageURISource;
    /**
     * The button system item
     */
    systemItem?: 'done' | 'cancel' | 'edit' | 'save' | 'add' | 'flexibleSpace'
        | 'fixedSpace' | 'compose' | 'reply' | 'action' | 'organize'
        | 'bookmarks' | 'search' | 'refresh' | 'stop' | 'camera'
        | 'trash' | 'play' | 'pause' | 'rewind' | 'fastForward';
    /**
     * Handles button click events
     */
    onPress?: () => void;
}

/**
 * Renders a button in the UI bar
 */
export class BarButtonIOS extends Component<BarButtonIOSProps> { }

/**
 * Defines the Search Bar Props contract
 */
export interface SearchBarIOSProps {
    /**
     * Indicates whether to to obscure the underlying content
     */
    obscureBackground?: boolean;
    /**
     * Indicates whether to hide the navigaiton bar
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
     * Handles text change events
     */
    onChangeText?: (text: string) => void;
}

/**
 * Renders a serach bar in the UI navigation bar
 */
export class SearchBarIOS extends Component<SearchBarIOSProps> { }

/**
 * Defines the Shared Element Props contract
 */
export interface SharedElementAndroidProps {
    /**
     * The name shared across scenes by the two elements
     */
    name: string;

    /**
     * The resource for the transition
     */
    transition?: string | ((mount: boolean) => string);

    /**
     * The style
     */
    style?: StyleProp<ViewStyle>;
}

/**
 * Shares its child UI element between scenes during navigation
 */
export class SharedElementAndroid extends Component<SharedElementAndroidProps> {}

/**
 * Defines the Tab Bar Item Props contract
 */
export interface TabBarItemIOSProps {
    /**
     * The tab title
     */
    title?: string;

    /**
     * The tab image
     */
    image?: ImageURISource;

    /**
     * The tab system item
     */
    systemItem?: 'bookmarks' | 'contacts' | 'downloads' | 'favorites'
        | 'featured' | 'history' | 'more' | 'most-recent' | 'most-viewed'
        | 'recents' | 'search' | 'top-rated';

    /**
     * Handles button click events
     */
    onPress?: () => void;
}

/**
 * Renders a tab in the UI tab bar
 */
export class TabBarItemIOS extends Component<TabBarItemIOSProps> {}

/**
 * Defines the Tab Bar Props contract
 */
export interface TabBarIOSProps {
    children: React.ReactElement<TabBarItemIOS> | React.ReactElement<TabBarItemIOS>[]
}

/**
 * Renders the UI tab bar
 */
export class TabBarIOS extends Component<TabBarIOSProps> {}
