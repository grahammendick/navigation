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
}