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
    }

    export class Transition {
        to: State;
        parent: State;
        index: number;
        key: string;
    }

    export class StateInfoConfig {
        dialogs: Array<Dialog>;
    }

    class CrumbTrailManager {
        static getHref(nextState: string, navigationData: any, returnData: any) {
        }
    }

    export class StateController {
        static navigate(action: string, toData?: any) {
        }
        static getNavigationLink(action: string, toData?: any) {
            return CrumbTrailManager.getHref(action, toData, null);
        }
        private static navigateLink(state: State, url: string) {
        }
    }
}
