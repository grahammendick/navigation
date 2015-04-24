declare module 'navigation' {
    export = Navigation;
} 

declare module Navigation {
    class Dialog {
        public _states: State[];
        public states: {
            [index: string]: State;
        };
        public index: number;
        public initial: State;
        public key: string;
        public title: string;
    }

    class State {
        public _transitions: Transition[];
        public transitions: {
            [index: string]: Transition;
        };
        public parent: Dialog;
        public index: number;
        public id: string;
        public key: string;
        public defaults: any;
        public defaultTypes: any;
        public formattedDefaults: any;
        public title: string;
        public route: string;
        public trackCrumbTrail: boolean;
        public stateHandler: IStateHandler;
        public dispose: () => void;
        public navigated: (data: any) => void;
        public navigating: (data: any, url: string, navigate: () => void) => void;
    }

    class Transition {
        public to: State;
        public parent: State;
        public index: number;
        public key: string;
    }

    class StateInfoConfig {
        static _dialogs: Dialog[];
        static dialogs: {
            [index: string]: Dialog;
        };
        static build(dialogs: any[]): void;
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
        public disabled: boolean;
        public replaceQueryIdentifier: boolean;
        public init(): void;
        public addHistory(state: State, url: string): void;
        public getCurrentUrl(): string;
        public getHref(url: string): string;
        public getUrl(anchor: HTMLAnchorElement): string;
    }

    class HTML5HistoryManager implements IHistoryManager {
        public disabled: boolean;
        public init(): void;
        public addHistory(state: State, url: string): void;
        public getCurrentUrl(): string;
        public getHref(url: string): string;
        public getUrl(anchor: HTMLAnchorElement): string;
    }

    export var historyManager: IHistoryManager;

    interface IStateHandler {
        getNavigationLink(state: State, data: any): string;
        navigateLink(oldState: State, state: State, url: string): any;
        getNavigationData(state: State, url: string): any;
        truncateCrumbTrail(state: State, crumbs: Crumb[]): Crumb[];
    }

    class Crumb {
        public data: any;
        public state: State;
        public last: boolean;
        public title: string;
        public navigationLink: any;
        public string: any;
        constructor(data: any, state: State, link: string, last: boolean);
    }

    class NavigationSettings {
        public stateIdKey: string;
        public previousStateIdKey: string;
        public returnDataKey: string;
        public crumbTrailKey: string;
        public applicationPath: string;
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
}