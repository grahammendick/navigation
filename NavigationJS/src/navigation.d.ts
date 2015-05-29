declare module 'navigation' {
    export = Navigation;
} 

declare module Navigation {
    /**
     * Configures dialog information. Represents a logical grouping of child
     * State elements. Navigating across different dialogs will initialise the
     * crumb trail
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
     * Configures state information. A child of a Dialog element, it 
     * represents the endpoint of a navigation
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

    interface ITransition<TState> {
        to: TState;
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

    class Transition implements ITransition<State> {
        to: State;
        parent: State;
        index: number;
        key: string;
    }

    class StateInfoConfig {
        static _dialogs: Dialog[];
        static dialogs: {
            [index: string]: Dialog;
        };
        static build(dialogs: IDialog<string, IState<ITransition<string>[]>[]>[]): void;
    }

    interface IHistoryManager {
        disabled: boolean;
        init(): any;
        addHistory(state: State, url: string): any;
        getCurrentUrl(): string;
        getHref(url: string): string;
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

    interface IStateHandler {
        getNavigationLink(state: State, data: any): string;
        navigateLink(oldState: State, state: State, url: string): any;
        getNavigationData(state: State, url: string): any;
        truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    }

    class Crumb {
        data: any;
        state: State;
        last: boolean;
        title: string;
        navigationLink: any;
        string: any;
        constructor(data: any, state: State, link: string, last: boolean);
    }

    class NavigationSettings {
        router: IRouter;
        historyManager: IHistoryManager;
        stateIdKey: string;
        previousStateIdKey: string;
        returnDataKey: string;
        crumbTrailKey: string;
        applicationPath: string;
    }

    class StateContext {
        static previousState: State;
        static previousDialog: Dialog;
        static state: State;
        static dialog: Dialog;
        static data: any;
        static url: string;
        static includeCurrentData(data: any, keys?: string[]): any;
        static clear(key?: string): void;
    }

    class StateController {
        static crumbs: Crumb[];
        static setStateContext(state: State, url: string): void;
        static onNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        static offNavigate(handler: (oldState: State, state: State, data: any) => void): void;
        static navigate(action: string, toData?: any): void;
        static getNavigationLink(action: string, toData?: any): string;
        static canNavigateBack(distance: number): boolean;
        static navigateBack(distance: number): void;
        static getNavigationBackLink(distance: number): string;
        static refresh(toData?: any): void;
        static getRefreshLink(toData?: any): string;
        static navigateLink(url: string): void;
        static getNextState(action: string): State;
    }

    class StateHandler implements IStateHandler {
        getNavigationLink(state: State, data: any): string;
        navigateLink(oldState: State, state: State, url: string): void;
        getNavigationData(state: State, url: string): any;
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