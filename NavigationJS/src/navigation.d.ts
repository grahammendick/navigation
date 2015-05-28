declare module 'navigation' {
    export = Navigation;
} 

declare module Navigation {
    interface IDialog<TState, TStates> {
        states: TStates;
        initial: TState;
        key: string;
        title?: string;
    }

    interface IState<TTransitions> {
        transitions?: TTransitions;
        key: string;
        defaults?: any;
        defaultTypes?: any;
        title?: string;
        route: string;
        trackCrumbTrail?: boolean;
    }

    interface ITransition<TState> {
        to: TState;
        key: string;
    }
    
    /**
     * Configures dialog information. Represents a logical grouping of child State elements.
     * Navigating across different dialogs will initialise the crumb trail
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
        index: number;
        initial: State;
        key: string;
        title: string;
    }

    class State implements IState<{ [index: string]: Transition; }> {
        _transitions: Transition[];
        transitions: {
            [index: string]: Transition;
        };
        parent: Dialog;
        index: number;
        id: string;
        key: string;
        defaults: any;
        defaultTypes: any;
        formattedDefaults: any;
        title: string;
        route: string;
        trackCrumbTrail: boolean;
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