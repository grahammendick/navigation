declare module 'navigation' {
    export = Navigation;
} 

declare module Navigation {
    /**
     * Defines a contract a class must implement in order to represent a
     * logical grouping of child State elements. Navigating across different
     * dialogs will initialise the crumb trail
     */
    interface IDialog<TState, TStates> {
        /**
         * Gets the State children
         */
        states: TStates;
        /**
         * Gets the state to navigate to if the Key is passed as an action
         * parameter to the StateController
         */
        initial: TState;
        /**
         * Gets the key, unique across dialogs, which is passed as the action
         * parameter to the StateController when navigating
         */
        key: string;
        /**
         * Gets the textual description of the dialog
         */
        title?: string;
    }

    /**
     * Defines a contract a class must implement in order to configure state 
     * information. A child of a Dialog element, it represents the endpoint of
     * a navigation
     */
    interface IState<TTransitions> {
        /**
         * Gets the Transition children
         */
        transitions?: TTransitions;
        /**
         * Gets the key, unique within a Parent, used by Dialog and Transition
         * elements to specify navigation configuration
         */
        key: string;
        /**
         * Gets the default NavigationData for this State
         */
        defaults?: any;
        /**
         * Gets the default NavigationData Types for  this State
         */
        defaultTypes?: any;
        /**
         * Gets the textual description of the state
         */
        title?: string;
        /**
         * Gets the route Url pattern
         */
        route: string;
        /**
         * Gets a value that indicates whether to maintain crumb trail 
         * information e.g PreviousState. This can be used together with Route
         * to produce user friendly Urls 
         */
        trackCrumbTrail?: boolean;
    }

    /**
     * Defines a contract a class must implement in order to configure 
     * transition information. A child of a State element it represents a
     * possible navigation from its Parent to a sibling State
     */
    interface ITransition<TState> {
        /**
         * Gets the state to navigate to if the Key is passed as an action
         * parameter to the StateController
         */
        to: TState;
        /**
         * Gets the key, unique within a Parent, which is passed as the action
         * parameter to the StateController when navigating
         */
        key: string;
    }
    
    /**
     * Configures dialog information. Represents a logical grouping of child 
     * State elements. Navigating across different dialogs will initialise the
     * crumb trail
     */
    class Dialog implements IDialog<State, { [index: string]: State; }> {
        /**
         * Gets the State children by index
         */
        _states: State[];
        /**
         * Gets the State children
         */
        states: {
            [index: string]: State;
        };
        /**
         * Gets the number of the dialog
         */
        index: number;
        /**
         * Gets the state to navigate to if the Key is passed as an action 
         * parameter to the StateController
         */
        initial: State;
        /**
         * Gets the key, unique across dialogs, which is passed as the action
         * parameter to the StateController when navigating
         */
        key: string;
        /**
         * Gets the textual description of the dialog
         */
        title: string;
    }

    /**
     * Configures state information. A child of a Dialog element, it 
     * represents the endpoint of a navigation
     */
    class State implements IState<{ [index: string]: Transition; }> {
        /**
         * Gets the Transition children by index
         */
        _transitions: Transition[];
        /**
         * Gets the Transition children
         */
        transitions: {
            [index: string]: Transition;
        };
        /**
         * Gets the parent Dialog configuration item
         */
        parent: Dialog;
        /**
         * Gets the number of the state within its Parent
         */
        index: number;
        /**
         * Gets the unique identifier for this State
         */
        id: string;
        /**
         * Gets the key, unique within a Parent, used by Dialog and Transition
         * elements to specify navigation configuration
         */
        key: string;
        /**
         * Gets the default NavigationData for this State
         */
        defaults: any;
        /**
         * Gets the default NavigationData Types for  this State
         */
        defaultTypes: any;
        /**
         * Gets the formatted default NavigationData for this State
         */
        formattedDefaults: any;
        /**
         * Gets the textual description of the state
         */
        title: string;
        /**
         * Gets the route Url pattern
         */
        route: string;
        /**
         * Gets a value that indicates whether to maintain crumb trail 
         * information e.g PreviousState. This can be used together with Route
         * to produce user friendly Urls 
         */
        trackCrumbTrail: boolean;
        /**
         * Gets or sets the IStateHandler responsible for building and parsing
         * avigation links to this State
         */
        stateHandler: IStateHandler;
        dispose: () => void;
        navigated: (data: any) => void;
        navigating: (data: any, url: string, navigate: () => void) => void;
    }

    /**
     * Configures transition information. A child of a State element it
     * represents a possible navigation from its Parent to a sibling State
     */
    class Transition implements ITransition<State> {
        /**
         * Gets the state to navigate to if the Key is passed as an action
         * parameter to the StateController
         */
        to: State;
        /**
         * Gets the parent State configuration item
         */
        parent: State;
        /**
         * Gets the number of the transition within its Parent
         */
        index: number;
        /**
         * Gets the key, unique within a Parent, which is passed as the action
         * parameter to the StateController when navigating
         */
        key: string;
    }

    /**
     * Provides static access to the Dialog, State and Transition configuration
     */
    class StateInfoConfig {
        /**
         * Gets a collection of Dialog information, by index, with their child
         * State information and grandchild Transition information
         */
        static _dialogs: Dialog[];
        /**
         * Gets a collection of Dialog information with their child State
         * information and grandchild Transition information
         */
        static dialogs: {
            [index: string]: Dialog;
        };
        /**
         * Builds the Dialog, State and Transition configuration
         * @para dialogs A collection of Dialog information with their child
         * State information and grandchild Transition information
         */
        static build(dialogs: IDialog<string, IState<ITransition<string>[]>[]>[]): void;
    }

    /**
     * Defines a contract a class must implement in order to manage the browser
     * Url
     */
    interface IHistoryManager {
        /**
         * Gets or sets a value indicating whether to disable browser history
         */
        disabled: boolean;
        /**
         * Registers browser history event listeners
         */
        init(): any;
        /**
         * Adds browser history
         * @param state The State navigated to
         * @param url The current url 
         */
        addHistory(state: State, url: string): void;
        /**
         * Gets the current location
         */
        getCurrentUrl(): string;
        /**
         * Gets an href from the url
         */
        getHref(url: string): string;
        /**
         * Gets a url from the anchor 
         */
        getUrl(anchor: HTMLAnchorElement): string;
    }

    class HashHistoryManager implements IHistoryManager {
        disabled: boolean;
        replaceQueryIdentifier: boolean;
        init(): void;
        addHistory(state: State, url: string): void;
        getCurrentUrl(): string;
        getHref(url: string): string;
        getUrl(anchor: HTMLAnchorElement): string;
    }

    class HTML5HistoryManager implements IHistoryManager {
        disabled: boolean;
        init(): void;
        addHistory(state: State, url: string): void;
        getCurrentUrl(): string;
        getHref(url: string): string;
        getUrl(anchor: HTMLAnchorElement): string;
    }

    /**
     * Defines a contract a class must implement in order to build and parse
     * navigation links
     */
    interface IStateHandler {
        /**
         * Gets a link that navigates to the state passing the data
         * @param state The State to navigate to
         * @param data The data to pass when navigating
         * @returns The navigation link
         */
        getNavigationLink(state: State, data: any): string;
        /**
         * Navigates to the url
         * @param oldState
         * @param state The State to navigate to
         * @param url The target location
         */
        navigateLink(oldState: State, state: State, url: string): void;
        /**
         * Gets the data parsed from the url
         * @param state The State navigated to
         * @param url The current url
         * @returns The navigation data
         */
        getNavigationData(state: State, url: string): any;
        /**
         * Truncates the crumb trail
         * @param The State navigated to
         * @param The Crumb collection representing the crumb trail
         * @returns Truncated crumb trail
         */
        truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    }

    /**
     * Represents one piece of the crumb trail and holds the information need
     * to return to and recreate the State as previously visited. In a single
     * crumb trail no two crumbs can have the same State but all must have the
     * same Dialog
     */
    class Crumb {
        /**
         * Gets the Context Data held at the time of navigating away from this
         * State
         */
        data: any;
        /**
         * Gets the configuration information associated with this navigation
         */
        state: State;
        /**
         * Gets a value indicating whether the Crumb is the last in the crumb
         * trail
         */
        last: boolean;
        /**
         * Gets the State Title
         */
        title: string;
        /**
         * Gets the hyperlink navigation to return to the State and pass the
         * associated Data
         */
        navigationLink: string;
        /**
         * Initializes a new instance of the Crumb class
         */
        constructor(data: any, state: State, link: string, last: boolean);
    }

    /**
     * Provides access to the Navigation Settings configuration
     */
    class NavigationSettings {
        router: IRouter;
        historyManager: IHistoryManager;
        /**
         * Gets or sets the key that identifies the StateId
         */
        stateIdKey: string;
        /**
         * Gets or sets the key that identifies the PreviousStateId
         */
        previousStateIdKey: string;
        /**
         * Gets or sets the key that identifies the ReturnData
         */
        returnDataKey: string;
        /**
         * Gets or sets the key that identifies the CrumbTrail
         */
        crumbTrailKey: string;
        /**
         * Gets or sets the application path
         */
        applicationPath: string;
    }

    /**
     * Provides static properties for accessing context sensitive navigation
     * information. Holds the current State and NavigationData. Also holds the
     * previous State (this is not the same as the previous Crumb)
     */
    class StateContext {
        /**
         * Gets the State navigated away from to reach the current State
         */
        static previousState: State;
        /**
         * Gets the parent of the PreviousState property
         */
        static previousDialog: Dialog;
        /**
         * Gets the current State
         */
        static state: State;
        /**
         * Gets the parent of the State property
         */
        static dialog: Dialog;
        /**
         * Gets the NavigationData for the current State. It can be accessed.
         * Will become the data stored in a Crumb when part of a crumb trail
         */
        static data: any;
        /**
         * Gets the current Url
         */
        static url: string;
        /** 
         * Combines the data with all the current NavigationData
         * @param The data to add to the current NavigationData
         * @returns The combined data
         */
        static includeCurrentData(data: any): any;
        /** 
         * Combines the data with a subset of the current NavigationData
         * @param The data to add to the current NavigationData
         * @returns The combined data
         */
        static includeCurrentData(data: any, keys: string[]): any;
        /**
         * Removes all items from the NavigationData
         */
        static clear(): void;
        /**
         * Removes a single item from the NavigationData
         * @param The key of the item to remove
         */
        static clear(key: string): void;
    }

    /**
     * Manages all navigation. These can be forward using an action parameter;
     * backward via a Crumb; or refreshing the current State
     */
    class StateController {
        /**
         * Gets a Crumb collection representing the crumb trail, ordered oldest
         * Crumb first
         */
        static crumbs: Crumb[];
        /**
         * Sets the Context Data with the data returned from the current
         * State's IStateHandler
         * @param state The current State
         * @param url The current Url
         */
        static setStateContext(state: State, url: string): void;
        static onNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        static offNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        /**
         * Navigates to a State. Depending on the action will either navigate
         * to the 'to' State of a Transition or the 'initial' State of a
         * Dialog. It passes no NavigationData
         * @param action The key of a child Transition or the key of a Dialog
         * @throws action does not match the key of a child Transition or the
         * key of a Dialog; or there is NavigationData that cannot be converted
         * to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        static navigate(action: string): void;
        /**
         * Navigates to a State. Depending on the action will either navigate
         * to the 'to' State of a Transition or the 'initial' State of a
         * Dialog
         * @param action The key of a child Transition or the key of a Dialog
         * @param toData The NavigationData to be passed to the next State and
         * stored in the StateContext
         * @throws action does not match the key of a child Transition or the
         * key of a Dialog; or there is NavigationData that cannot be converted
         * to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        static navigate(action: string, toData: any): void;
        /**
         * Gets a Url to navigate to a State. Depending on the action will
         * either navigate to the 'to' State of a Transition or the 'initial'
         * State of a Dialog. It passes no NavigationData
         * @param action The key of a child Transition or the key of a Dialog
         * @returns Url that will navigate to State specified in the action
         * @throws action does not match the key of a child Transition or the
         * key of a Dialog; or there is NavigationData that cannot be converted
         * to a String
         */
        static getNavigationLink(action: string): string;
        /**
         * Gets a Url to navigate to a State. Depending on the action will
         * either navigate to the 'to' State of a Transition or the 'initial'
         * State of a Dialog
         * @param action The key of a child Transition or the key of a Dialog
         * @param toData The NavigationData to be passed to the next State and
         * stored in the StateContext
         * @returns Url that will navigate to State specified in the action
         * @throws action does not match the key of a child Transition or the
         * key of a Dialog; or there is NavigationData that cannot be converted
         * to a String
         */
        static getNavigationLink(action: string, toData: any): string;
        /**
         * Determines if the distance specified is within the bounds of the
         * crumb trail represented by the Crumbs collection
         */
        static canNavigateBack(distance: number): boolean;
        /**
         * Navigates back to the Crumb contained in the crumb trail,
         * represented by the Crumbs collection, as specified by the distance.
         * In the crumb trail no two crumbs can have the same State but all
         * must have the same Dialog
         * @param distance Starting at 1, the number of Crumb steps to go back
         * @throws canNavigateBack returns false for this distance
         * @throws A mandatory route parameter has not been supplied a value
         */
        static navigateBack(distance: number): void;
        /**
         * Gets a Url to navigate to a Crumb contained in the crumb trail, 
         * represented by the Crumbs collection, as specified by the distance.
         * In the crumb trail no two crumbs can have the same State but all
         * must have the same Dialog
         * @param distance Starting at 1, the number of Crumb steps to go back
         * @throws canNavigateBack returns false for this distance
         */
        static getNavigationBackLink(distance: number): string;
        /**
         * Navigates to the current State passing no NavigationData
         * @throws A mandatory route parameter has not been supplied a value
         */
        static refresh(): void;
        /**
         * Navigates to the current State
         * @param toData The NavigationData to be passed to the current State
         * and stored in the StateContext
         * @throws There is NavigationData that cannot be converted to a String
         * @throws A mandatory route parameter has not been supplied a value
         */
        static refresh(toData: any): void;
        /**
         * Gets a Url to navigate to the current State passing no 
         * NavigationData
         */
        static getRefreshLink(): string;
        /**
         * Gets a Url to navigate to the current State
         * @param toData The NavigationData to be passed to the current State
         * and stored in the StateContext
         * @returns Url that will navigate to the current State
         * @throws There is NavigationData that cannot be converted to a String
         */
        static getRefreshLink(toData: any): string;
        /**
         * Navigates to the url
         * @param url The target location
         */
        static navigateLink(url: string): void;
        /**
         * Gets the next State. Depending on the action will either return the
         * 'to' State of a Transition or the 'initial' State of a Dialog
         * @param action The key of a child Transition or the key of a Dialog
         * @throws action does not match the key of a child Transition or the
         * key of a Dialog
         */
        static getNextState(action: string): State;
    }

    /**
     * Implementation of IStateHandler that builds and parses navigation links
     */
    class StateHandler implements IStateHandler {
        /**
         * Gets a link that navigates to the state passing the data
         * @param state The State to navigate to
         * @param data The data to pass when navigating
         * @returns The navigation link
         */
        getNavigationLink(state: State, data: any): string;
        /**
         * Navigates to the url
         * @param oldState
         * @param state The State to navigate to
         * @param url The target location
         */
        navigateLink(oldState: State, state: State, url: string): void;
        /**
         * Gets the data parsed from the url
         * @param state The State navigated to
         * @param url The current url
         * @returns The navigation data
         */
        getNavigationData(state: State, url: string): any;
        /**
         * Truncates the crumb trail whenever a repeated or initial State is
         * encountered
         * @param The State navigated to
         * @param The Crumb collection representing the crumb trail
         * @returns Truncated crumb trail
         */
        truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    }

    interface IRouter {
        getData(route: string): {
            state: State;
            data: any;
        };
        getRoute(state: State, data: any): {
            route: string;
            data: any;
        };
        supportsDefaults: boolean;
        addRoutes(dialogs: Dialog[]): any;
    }

    class StateRouter implements IRouter {
        router: Router;
        supportsDefaults: boolean;
        getData(route: string): {
            state: State;
            data: any;
        };
        getRoute(state: State, data: any): {
            route: string;
            data: any;
        };
        addRoutes(dialogs: Dialog[]): void;
    }

    class Route {
        path: string;
        defaults: any;
        params: {
            name: string;
            optional: boolean;
        }[];
        constructor(path: string, defaults?: any);
        match(path: string): any;
        build(data?: any): string;
    }

    class Router {
        addRoute(path: string, defaults?: any): Route;
        match(path: string): {
            route: Route;
            data: any;
        };
    }

    export var settings: NavigationSettings;

    export var start: (url?: string) => void;
}