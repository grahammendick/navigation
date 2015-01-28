module Navigation {
    export class Dialog {
        states: Array<State>;
        index: number;
        initial: State;
        key: string;
        title: string;
    }

    export class State {
        states: Array<Transition>;
        parent: Dialog;
        index: number;
        key: string;
        title: string;
        route: string;
        trackCrumbTrail: boolean;
        attributes: Array<string>;
        stateHandler: IStateHandler;
    }

    export class Transition {
        to: State;
        parent: State;
        index: number;
        key: string;
    }

    export class Crumb {
        data: any;
        state: State;
        last: boolean;
        getNavigationLink(): string {
            return '';
        }
    }

    export interface IStateHandler {
    }

    export class StateInfoConfig {
        dialogs: Array<Dialog>;
    }

    class CrumbTrailManager {
        static getHref(nextState: string, navigationData: any, returnData: any): string {
            return null;
        }
    }

    export class StateController {
        static navigate(action: string, toData?: any) {
        }

        static getNavigationLink(action: string, toData?: any): string {
            return CrumbTrailManager.getHref(action, toData, null);
        }

        private static navigateLink(state: State, url: string) {
        }
    }
}
