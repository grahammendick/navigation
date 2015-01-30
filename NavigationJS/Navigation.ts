module Navigation {
    export class Crumb {
        data: any;
        state: State;
        last: boolean;
        constructor(data: any, state: State, last: boolean) {
            this.data = data;
            this.state = state;
            this.last = last;
        }
        getNavigationLink(): string {
            return CrumbTrailManager.getHref(this.state, this.data, null);
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
        static returnData: any;
        static crumbTrail: string;

        static buildCrumbTrail() {
            var crumbs = this.getCrumbs(false);
            if (StateContext.previousState)
                crumbs.push(new Crumb(this.returnData, StateContext.previousState, false));
            crumbs.reverse();
            var trailString: string = '';
            for (var i = 0; i < crumbs.length; i++) {
                trailString += '4_' + crumbs[i].state.id + '5_';
                trailString += this.formatReturnData(crumbs[i].data);
            }
            this.crumbTrail = trailString ? trailString : null;
        }

        static getCrumbs(setLast: boolean): Array<Crumb> {
            var crumbTrailArray: Array<Crumb> = [];
            var arrayCount = 0;
            var trail = this.crumbTrail;
            var crumbTrailSize = !trail ? 0 : trail.split('4_').length - 1;
            var last = true;
            while (arrayCount < crumbTrailSize) {
                var stateKey = trail.substring('4_'.length).split('5_')[0];
                var state = this.getState(stateKey);
                var navigationData: any;
                var data = trail.substring((trail.indexOf('5_') + '5_'.length)).split('4_')[0];
                if (data)
                    navigationData = {};
                var nextTrailStart = trail.indexOf('4_', 1);
                trail = nextTrailStart != -1 ? trail.substring(nextTrailStart) : '';
                crumbTrailArray.push(new Crumb(navigationData, state, setLast && last));
                last = false;
                arrayCount++;
            }
            crumbTrailArray.reverse();
            return crumbTrailArray;
        }

        static getState(id: string) {
            if (!id) return null;
            var ids = id.split('-');
            return StateInfoConfig.dialogs[+ids[0]].states[+ids[1]];
        }

        static getHref(state: State, navigationData: any, returnData: any): string {
            var data = {};
            if (state.trackCrumbTrail && StateContext.state) {
                data['c1'] = StateContext.state.id;
            }
            for (var key in navigationData) {
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

        static formatReturnData(returnData: any): string {
            var returnDataArray: Array<string> = [];
            for (var key in returnData) {
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
            StateContext.previousState = CrumbTrailManager.getState(StateContext.data['c1']);
            delete StateContext.data['c1'];
            StateContext.previousDialog = null;
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
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
