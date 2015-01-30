module Navigation {
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
        getNavigationData(state: State, data: string): any;
    }

    export class StateHandler implements IStateHandler {
        getNavigationLink(state: State, data: any): string {
            return null;
        }

        navigateLink(state: State, url: string) {
        }

        getNavigationData(state: State, data: any): any {
            return null;
        }
    }

    export class StateContext {
        static previousState: State;
        static previousDialog: Dialog;
        static state: State;
        static dialog: Dialog;
        static data: any;
    }

    class CrumbTrailManager {
        static getHref(state: State, navigationData: any, returnData: any): string {
            var data = {};
            if (state.trackCrumbTrail && StateContext.state) {
                data['c1'] = StateContext.state.id;
            }
            for (var key in navigationData) {
                if (navigationData[key])
                    data[key] = navigationData[key];
            }
            if (state.trackCrumbTrail && StateContext.state) {
                var returnDataString = this.formatReturnData(returnData);
                if (returnDataString) {
                    data['c2'] = returnDataString;
                }
            }
            return state.stateHandler.getNavigationLink(state, data);
        }

        private static formatReturnData(returnData: any) {
            var returnDataArray: Array<string> = [];
            for (var key in returnData) {
                if (returnData[key])
                    returnDataArray.push(key + '1_' + returnData[key]);
            }
            return returnDataArray.join('3_');
        }

        static getRefreshHref(refreshData: any): string {
            return this.getHref(StateContext.state, refreshData, null);
        }
    }

    export class StateController {
        static setStateContext(state: State, data: any) {
            StateContext.state = state;
            StateContext.dialog = state.parent;
            StateContext.data = state.stateHandler.getNavigationData(state, data);
            StateContext.previousState = this.getState(StateContext.data['c1']);
            delete StateContext.data['c1'];
            StateContext.previousDialog = null;
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
        }

        private static getState(id: string) {
            if (!id) return null;
            var ids = id.split('-');
            if (ids.length != 2) return null;
            var dialogIndex = +ids[0];
            var stateIndex = +ids[1];
            if (isNaN(dialogIndex) || isNaN(stateIndex)) return null;
            return StateInfoConfig.dialogs[dialogIndex].states[stateIndex];
        }

        static navigate(action: string, toData?: any) {
            var url = this.getNavigationLink(action, toData);
            this.navigateLink(this.getNextState(action), url);
        }

        static getNavigationLink(action: string, toData?: any): string {
            return CrumbTrailManager.getHref(this.getNextState(action), toData, StateContext.data);
        }

        static refresh(toData?: any) {
            var url = this.getRefreshLink(toData);
            this.navigateLink(StateContext.state, url);
        }

        static getRefreshLink(toData?: any): string {
            return CrumbTrailManager.getRefreshHref(toData);
        }

        private static navigateLink(state: State, url: string) {
            state.stateHandler.navigateLink(state, url);
        }

        private static getNextState(action: string): State {
            if (!action)
                throw new Error('action is required');
            var nextState: State = null;
            if (StateContext.state && StateContext.state._transitions[action])
                nextState = StateContext.state._transitions[action].to;
            if (!nextState && StateInfoConfig._dialogs[action])
                nextState = StateInfoConfig._dialogs[action].initial;
            if (!nextState)
                throw new Error('invalid action');
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
