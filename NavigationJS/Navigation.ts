module Navigation {
    export class Crumb {
        data: any;
        state: State;
        last: boolean;
        title: string;
        private _navigationLink; string;

        constructor(data: any, state: State, last: boolean) {
            this.data = data;
            this.state = state;
            this.last = last;
            this.title = state.title;
        }

        getNavigationLink(): string {
            if (!this._navigationLink)
                this._navigationLink = CrumbTrailManager.getHref(this.state, this.data, null);
            return this._navigationLink;
        }
    }

    export interface IStateHandler {
        getNavigationLink(state: State, data: any): string;
        navigateLink(state: State, url: string);
        getNavigationData(state: State, data: string): any;
        truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb>;
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

        truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb> {
            var newCrumbs: Array<Crumb> = [];
            if (state.parent.initial === state)
                return newCrumbs;
            for (var i = 0; i < crumbs.length; i++) {
                if (crumbs[i].state === state)
                    break;
                newCrumbs.push(crumbs[i]);
            }
            return newCrumbs;
        }
    }

    export class StateContext {
        static previousState: State;
        static previousDialog: Dialog;
        static state: State;
        static dialog: Dialog;
        static data: any;

        static newCurrentData(keys?: Array<string>): any {
            if (!keys) {
                keys = [];
                for (var key in this.data)
                    keys.push(key);
            }
            var data: any = {};
            for (var i = 0; i < keys.length; i++)
                data[keys[i]] = this.data[keys[i]];
            return data;
        }
    }

    class CrumbTrailManager {
        static returnData: any;
        static crumbTrail: string;
        private static SEPARATOR = '_';
        private static RET_1_SEP = '1_';
        private static RET_2_SEP = '2_';
        private static RET_3_SEP = '3_';
        private static CRUMB_1_SEP = '4_';
        private static CRUMB_2_SEP = '5_';

        static buildCrumbTrail() {
            var crumbs = this.getCrumbs(false);
            if (StateContext.previousState)
                crumbs.push(new Crumb(this.returnData, StateContext.previousState, false));
            crumbs = StateContext.state.stateHandler.truncateCrumbTrail(StateContext.state, crumbs);
            crumbs.reverse();
            var trailString: string = '';
            for (var i = 0; i < crumbs.length; i++) {
                trailString += this.CRUMB_1_SEP + crumbs[i].state.id + this.CRUMB_2_SEP;
                trailString += this.formatReturnData(crumbs[i].data);
            }
            this.crumbTrail = trailString ? trailString : null;
        }

        static getCrumbs(setLast: boolean): Array<Crumb> {
            var crumbTrailArray: Array<Crumb> = [];
            var arrayCount = 0;
            var trail = this.crumbTrail;
            var crumbTrailSize = !trail ? 0 : trail.split(this.CRUMB_1_SEP).length - 1;
            var last = true;
            while (arrayCount < crumbTrailSize) {
                var stateKey = trail.substring(this.CRUMB_1_SEP.length).split(this.CRUMB_2_SEP)[0];
                var state = this.getState(stateKey);
                var navigationData: any;
                var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
                if (data)
                    navigationData = this.parseReturnData(data);
                var nextTrailStart = trail.indexOf(this.CRUMB_1_SEP, 1);
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
            if (state.trackCrumbTrail && StateContext.state)
                data['c1'] = StateContext.state.id;
            for (var key in navigationData) {
                if (navigationData[key] != null && navigationData[key].toString())
                    data[key] = navigationData[key];
            }
            if (state.trackCrumbTrail && StateContext.state) {
                var returnDataString = this.formatReturnData(returnData);
                if (returnDataString)
                    data['c2'] = returnDataString;
            }
            if (this.crumbTrail && state.trackCrumbTrail)
                data['c3'] = this.crumbTrail;
            return state.stateHandler.getNavigationLink(state, data);
        }

        private static formatReturnData(returnData: any): string {
            var returnDataArray: Array<string> = [];
            for (var key in returnData) {
                if (returnData[key] != null && returnData[key].toString())
                    returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.encodeUrlValue(returnData[key]));
            }
            return returnDataArray.join(this.RET_3_SEP);
        }

        private static decodeUrlValue(urlValue: string): string {
            return urlValue.replace('0' + this.SEPARATOR, this.SEPARATOR); 
        }

        private static encodeUrlValue(urlValue: string): string {
            return urlValue.replace(this.SEPARATOR, '0' + this.SEPARATOR);
        }

        static getRefreshHref(refreshData: any): string {
            return this.getHref(StateContext.state, refreshData, null);
        }

        static parseReturnData(returnData: string): any {
            var navigationData = {};
            var returnDataArray = returnData.split(this.RET_3_SEP);
            for (var i = 0; i < returnDataArray.length; i++) {
                var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
                navigationData[this.decodeUrlValue(nameValuePair[0])] = this.decodeUrlValue(nameValuePair[1]);
            }
            return navigationData;
        }
    }

    export class StateController {
        static crumbs: Array<Crumb>;

        static setStateContext(state: State, data: any) {
            StateContext.state = state;
            StateContext.dialog = state.parent;
            StateContext.data = state.stateHandler.getNavigationData(state, data);
            StateContext.previousState = CrumbTrailManager.getState(StateContext.data['c1']);
            StateContext.previousDialog = null;
            if (StateContext.previousState)
                StateContext.previousDialog = StateContext.previousState.parent;
            CrumbTrailManager.returnData = null;
            if (StateContext.data['c2'])
                CrumbTrailManager.returnData = CrumbTrailManager.parseReturnData(StateContext.data['c2']);
            CrumbTrailManager.crumbTrail = StateContext.data['c3'];
            CrumbTrailManager.buildCrumbTrail();
            this.crumbs = CrumbTrailManager.getCrumbs(true);
            delete StateContext.data['c1'];
            delete StateContext.data['c2'];
            delete StateContext.data['c3'];
        }

        static navigate(action: string, toData?: any) {
            var url = this.getNavigationLink(action, toData);
            this.navigateLink(this.getNextState(action), url);
        }

        static getNavigationLink(action: string, toData?: any): string {
            return CrumbTrailManager.getHref(this.getNextState(action), toData, StateContext.data);
        }

        static canNavigateBack(distance: number) {
            var canNavigate = false;
            if (distance <= this.crumbs.length && distance > 0)
                canNavigate = true;
            return canNavigate
        }

        static navigateBack(distance: number) {
            var url = this.getNavigationBackLink(distance);
            this.navigateLink(this.getCrumb(distance).state, url);
        }

        static getNavigationBackLink(distance: number): string {
            return this.getCrumb(distance).getNavigationLink();
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

        private static getCrumb(distance: number): Crumb {
            if (distance > this.crumbs.length || distance <= 0) {
                throw new Error('Invalid distance');
            }
            return this.crumbs[this.crumbs.length - distance];
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
