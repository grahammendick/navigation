module Navigation {
    export class Dialog {
        states: Array<State>;
        index: number;
        initial: State;
        key: string;
        title: string;
    }

    export class State {
        transitions: Array<Transition>;
        _transitions: { [index: string]: Transition };
        parent: Dialog;
        index: number;
        key: string;
        title: string;
        route: string;
        trackCrumbTrail: boolean;
        attributes: Array<string>;
        stateHandler: IStateHandler;
        Id(): string{
            return this.parent.index.toString() + '-' + this.index.toString();
        }
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
        static dialogs: Array<Dialog>;
        static _dialogs: { [index: string]: Dialog };
    }

    export class StateContext {
        static previousState: State;
        static previousDialog: Dialog;
        static state: State;
        static dialog: Dialog;
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
            return CrumbTrailManager.getHref(this.getNextState(action).Id(), toData, null);
        }

        private static navigateLink(state: State, url: string) {
        }

        private static getNextState(action: string): State {
            if (!action)
                throw "action is required";
            var nextState: State = null;
            if (StateContext.state && StateContext.state._transitions[action])
                nextState = StateContext.state._transitions[action].to;
            if (!nextState && StateInfoConfig._dialogs[action])
                nextState = StateInfoConfig._dialogs[action].initial;
            if (!nextState)
                throw "invalid action";
            return nextState;
        }
    }
}
