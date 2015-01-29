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
        stateHandler: IStateHandler = new StateHandler();
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
        getNavigationLink(state: State, data: any): string;
        navigateLink(state: State, url: string);
        getNavigationData(state: State, url: string): any;
    }

    export class StateHandler implements IStateHandler {
        getNavigationLink(state: State, data: any): string {
            return null;
        }

        navigateLink(state: State, url: string) {
            StateController.setStateContext(state, url);
        }

        getNavigationData(state: State, url: string): any {
            return null;
        }
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
        static data: any;
    }

    class CrumbTrailManager {
        static getHref(nextState: State, navigationData: any, returnData: any): string {
            return nextState.stateHandler.getNavigationLink(nextState, null);
        }
    }

    export class StateController {
        static setStateContext(state: State, url: string) {
            StateContext.state = state;
            var data = state.stateHandler.getNavigationData(state, url);
        }

        static navigate(action: string, toData?: any) {
            var url = this.getNavigationLink(action, toData);
            if (!url)
                throw "invalid route data";
            this.navigateLink(this.getNextState(action), url);
        }

        static getNavigationLink(action: string, toData?: any): string {
            return CrumbTrailManager.getHref(this.getNextState(action), toData, StateContext.data);
        }

        private static navigateLink(state: State, url: string) {
            state.stateHandler.navigateLink(state, url);
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

    /* Detect if the Url changes
    //  1. page load
    //  2. pop state
    //  3. push state (http://stackoverflow.com/questions/4570093)
    //  4. onhashchange (ie8?)
    //  5. poll for hashchange (ie7)
    // Then raise Navigate event.
    // Custom StateAdapter listens, calls StateController.SetContext
    // and does custom logic like changing ViewModel
    */
}
