module Navigation {
    export class Dialog {
        _states: Array<State> = [];
        states: { [index: string]: State } = {};
        index: number;
        initial: State;
        key: string;
        title: string;
    }

    export class State {
        _transitions: Array<Transition> = [];
        transitions: { [index: string]: Transition } = {};
        parent: Dialog;
        index: number;
        id: string;
        key: string;
        defaults: any = {};
        defaultTypes: any = {};
        formattedDefaults: any = {};
        title: string;
        route: string;
        trackCrumbTrail: boolean = true;
        stateHandler: IStateHandler = new StateHandler();
        ended: () => void = function () { };
        started: () => void = function () { };
        starting: (data: any, url: string, start: () => void) => void = function (data, url, start) { start(); } 
    }

    export class Transition {
        to: State;
        parent: State;
        index: number;
        key: string;
    }

    export class StateInfoConfig {
        static _dialogs: Array<Dialog> = [];
        static dialogs: { [index: string]: Dialog } = {};
        static build(dialogs: Array<any>) {
            this._dialogs = [];
            this.dialogs = {};
            for (var i = 0; i < dialogs.length; i++) {
                var dialogObject = dialogs[i];
                var dialog = new Dialog();
                dialog.index = i;
                for (var key in dialogObject) {
                    if (key !== 'states')
                        dialog[key] = dialogObject[key];
                }
                if (!dialog.key)
                    throw new Error('Dialog key is mandatory');
                if (this.dialogs[dialog.key])
                    throw new Error('Duplicate dialog key');
                this._dialogs.push(dialog);
                this.dialogs[dialog.key] = dialog;
                this.processStates(dialog, dialogObject);
                this.processTransitions(dialog, dialogObject);
                dialog.initial = dialog.states[dialogObject.initial];
                if (!dialogObject.initial)
                    throw new Error('Dialog initial is mandatory');
                if (!dialog.initial)
                    throw new Error('Invalid dialog initial key');
            }
            router.addRoutes(StateInfoConfig._dialogs);
            //StateController.navigateLink(window.location.href)
        }

        private static processStates(dialog: Dialog, dialogObject: any) {
            for (var i = 0; i < dialogObject.states.length; i++) {
                var stateObject = dialogObject.states[i];
                var state = new State();
                state.parent = dialog;
                state.index = i;
                state.id = dialog.index + '-' + state.index;
                for (var key in stateObject) {
                    if (key !== 'transitions')
                        state[key] = stateObject[key];
                }
                for (var key in state.defaults) {
                    if (!state.defaultTypes[key])
                        state.defaultTypes[key] = typeof state.defaults[key];
                    state.formattedDefaults[key] = CrumbTrailManager.formatURLObject(key, state.defaults[key], state);
                }
                if (!state.key)
                    throw new Error('State key is mandatory');
                if (dialog.states[state.key])
                    throw new Error('Duplicate state key');
                dialog._states.push(state);
                dialog.states[state.key] = state;
            }
        }

        private static processTransitions(dialog: Dialog, dialogObject: any) {
            for (var i = 0; i < dialogObject.states.length; i++) {
                if (dialogObject.states[i].transitions) {
                    for (var j = 0; j < dialogObject.states[i].transitions.length; j++) {
                        var transitionObject = dialogObject.states[i].transitions[j];
                        var transition = new Transition();
                        transition.index = j;
                        transition.key = transitionObject.key;
                        if (!transition.key)
                            throw new Error('Transition key is mandatory');
                        transition.parent = dialog._states[i];
                        transition.to = dialog.states[transitionObject.to];
                        if (!transitionObject.to)
                            throw new Error('Transition to is mandatory');
                        if (!transition.to)
                            throw new Error('Invalid transition to key');
                        if (transition.parent.transitions[transition.key])
                            throw new Error('Duplicate transition key');
                        transition.parent._transitions.push(transition);
                        transition.parent.transitions[transition.key] = transition;
                    }
                }
            }
        }
    }

    export class Crumb {
        data: any;
        state: State;
        last: boolean;
        title: string;
        navigationLink; string;

        constructor(data: any, state: State, last: boolean) {
            this.data = data ? data : {};
            this.state = state;
            this.last = last;
            this.title = state.title;
            this.navigationLink = CrumbTrailManager.getHref(this.state, this.data, null);
            NavigationData.setDefaults(this.data, this.state.defaults);
        }
    }

    export interface IStateHandler {
        getNavigationLink(state: State, data: any): string;
        navigateLink(state: State, url: string);
        getNavigationData(state: State, url: string): any;
        truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb>;
    }

    export class StateHandler implements IStateHandler {
        getNavigationLink(state: State, data: any): string {
            delete data['c0'];
            var route = router.getRoute(state, data);
            var routeData = router.getData(route);
            var query: Array<string> = [];
            for (var key in data) {
                if (!routeData || routeData[key] == null)
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
            query.sort();
            if (query.length > 0)
                route += '?' + query.join('&');
            return route;
        }

        navigateLink(state: State, url: string) {
            StateController.setStateContext(state, url);
            //pushState - if url doesn't match window.location.href
        }

        getNavigationData(state: State, url: string): any {
            var queryIndex = url.indexOf('?');
            var data = router.getData(queryIndex < 0 ? url : url.substring(0, queryIndex));
            data = data ? data : {};
            if (queryIndex >= 0) {
                var query = url.substring(queryIndex + 1);
                var params = query.split('&');
                for (var i = 0; i < params.length; i++) {
                    var param = params[i].split('=');
                    data[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
                }
            }
            return data;
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

    export interface IRouter {
        getData(route: string): any;
        getRoute(state: State, data: any): string;
        supportsDefaults: boolean;
        addRoutes(dialogs: Array<Dialog>);
    }

    export var router: IRouter;

    class NavigationData {
        static setDefaults(data: any, defaults: any) {
            for (var key in defaults) {
                if (data[key] == null || !data[key].toString())
                    data[key] = defaults[key];
            }
        }

        static clone(data: any) {
            var clone = {};
            for (var key in data)
                clone[key] = data[key];
            return clone;
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

        static clear(key?: string) {
            if (key)
                this.data[key] = this.state.defaults[key];
            else {
                for (var key in this.data) {
                    this.data[key] = this.state.defaults[key];
                }
            }
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
                trailString += this.formatReturnData(crumbs[i].state, crumbs[i].data);
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
                var navigationData: any = {};
                var data = trail.substring((trail.indexOf(this.CRUMB_2_SEP) + this.CRUMB_2_SEP.length)).split(this.CRUMB_1_SEP)[0];
                if (data)
                    navigationData = this.parseReturnData(data, state);
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
            return StateInfoConfig._dialogs[+ids[0]]._states[+ids[1]];
        }

        static getHref(state: State, navigationData: any, returnData: any): string {
            var data = {};
            data['c0'] = state.id;
            if (state.trackCrumbTrail && StateContext.state)
                data['c1'] = StateContext.state.id;
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
            for (var key in navigationData) {
                if (navigationData[key] != null && navigationData[key].toString()
                    && (!router.supportsDefaults || navigationData[key] !== state.defaults[key]))
                    data[key] = this.formatURLObject(key, navigationData[key], state);
            }
            if (state.trackCrumbTrail && StateContext.state) {
                var returnDataString = this.formatReturnData(state, returnData);
                if (returnDataString)
                    data['c2'] = returnDataString;
            }
            if (this.crumbTrail && state.trackCrumbTrail)
                data['c3'] = this.crumbTrail;
            return state.stateHandler.getNavigationLink(state, data);
        }

        private static formatReturnData(state: State, returnData: any): string {
            var returnDataArray: Array<string> = [];
            for (var key in returnData) {
                if (returnData[key] != null && returnData[key].toString()
                    && (!router.supportsDefaults || returnData[key] !== state.defaults[key]))
                    returnDataArray.push(this.encodeUrlValue(key) + this.RET_1_SEP + this.formatURLObject(key, returnData[key], state));
            }
            return returnDataArray.join(this.RET_3_SEP);
        }

        private static decodeUrlValue(urlValue: string): string {
            return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR); 
        }

        private static encodeUrlValue(urlValue: string): string {
            return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
        }

        static formatURLObject(key: string, urlObject: any, state: State) {
            var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
            var converterKey = ConverterFactory.getKeyFromObject(urlObject);
            var formattedValue = ConverterFactory.getConverter(converterKey).convertTo(urlObject);
            formattedValue = this.encodeUrlValue(formattedValue);
            if (typeof urlObject !== defaultType)
                formattedValue += this.RET_2_SEP + converterKey;
            return formattedValue; 
        }

        static parseURLString(key: string, val: string, state: State): any {
            var defaultType: string = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
            var urlValue = val;
            var converterKey = ConverterFactory.getKey(defaultType);
            if (val.indexOf(this.RET_2_SEP) > -1) {
                var arr = val.split(this.RET_2_SEP);
                urlValue = arr[0];
                converterKey = arr[1];
            }
            try {
                return ConverterFactory.getConverter(converterKey).convertFrom(this.decodeUrlValue(urlValue));
            } catch (e) {
                throw new Error('Invalid Url');
            }
        }

        static getRefreshHref(refreshData: any): string {
            return this.getHref(StateContext.state, refreshData, null);
        }

        static parseReturnData(returnData: string, state: State): any {
            var navigationData = {};
            var returnDataArray = returnData.split(this.RET_3_SEP);
            for (var i = 0; i < returnDataArray.length; i++) {
                var nameValuePair = returnDataArray[i].split(this.RET_1_SEP);
                navigationData[this.decodeUrlValue(nameValuePair[0])] = this.parseURLString(this.decodeUrlValue(nameValuePair[0]), nameValuePair[1], state);
            }
            return navigationData;
        }
    }

    export class StateController {
        static crumbs: Array<Crumb>;

        static setStateContext(state: State, url: string) {
            var oldState = StateContext.state;
            try {
                StateContext.state = state;
                StateContext.dialog = state.parent;
                var data = state.stateHandler.getNavigationData(state, url);
                StateContext.previousState = CrumbTrailManager.getState(data['c1']);
                StateContext.previousDialog = null;
                if (StateContext.previousState)
                    StateContext.previousDialog = StateContext.previousState.parent;
                CrumbTrailManager.returnData = {};
                if (data['c2'])
                    CrumbTrailManager.returnData = CrumbTrailManager.parseReturnData(data['c2'], state);
                CrumbTrailManager.crumbTrail = data['c3'];
                StateContext.data = this.parseData(data, state);
                CrumbTrailManager.buildCrumbTrail();
                this.crumbs = CrumbTrailManager.getCrumbs(true);
            } catch (e) {
                throw new Error('Invalid Url');
            }
            if (oldState !== state) {
                if (oldState)
                    oldState.ended();
                state.started();
            }
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
            return this.getCrumb(distance).navigationLink;
        }

        static refresh(toData?: any) {
            var url = this.getRefreshLink(toData);
            this.navigateLink(StateContext.state, url);
        }

        static getRefreshLink(toData?: any): string {
            return CrumbTrailManager.getRefreshHref(toData);
        }

        static navigateLink(state: State, url: string) {
            var oldState = StateContext.state;
            if (oldState !== state) {
                try {
                    var data = state.stateHandler.getNavigationData(state, url);
                    data = this.parseData(data, state);
                } catch (e) {
                    throw new Error('Invalid Url');
                }
                state.starting(data, url, () => {
                    if (oldState === StateContext.state)
                        state.stateHandler.navigateLink(state, url);
                });
            } else {
                state.stateHandler.navigateLink(state, url);
            }
        }

        private static parseData(data: any, state: State): any {
            var newData = {};
            for (var key in data) {
                if (key !== 'c1' && key !== 'c2' && key !== 'c3')
                    newData[key] = CrumbTrailManager.parseURLString(key, data[key], state);
            }
            NavigationData.setDefaults(newData, state.defaults);
            return newData;
        }

        static getNextState(action: string): State {
            if (!action)
                throw new Error('action is required');
            var nextState: State = null;
            if (StateContext.state && StateContext.state.transitions[action])
                nextState = StateContext.state.transitions[action].to;
            if (!nextState && StateInfoConfig.dialogs[action])
                nextState = StateInfoConfig.dialogs[action].initial;
            if (!nextState)
                throw new Error('invalid action');
            return nextState;
        }

        private static getCrumb(distance: number): Crumb {
            if (distance > this.crumbs.length || distance <= 0)
                throw new Error('Invalid distance');
            return this.crumbs[this.crumbs.length - distance];
        }
    }

    class TypeConverter{
        getType(): string {
            return null;
        }

        convertFrom(val: string): any {
            return null;
        }

        convertTo(val: any): string {
            return null;
        }
    }

    class StringConverter extends TypeConverter {
        getType(): string {
            return 'string';
        }

        convertFrom(val: string): any {
            return val;
        }

        convertTo(val: any): string {
            return val.toString();
        }
    }

    class BooleanConverter extends TypeConverter {
        getType(): string {
            return 'boolean';
        }

        convertFrom(val: string): any {
            return val === 'true';
        }

        convertTo(val: any): string {
            return val.toString();
        }
    }

    class NumberConverter extends TypeConverter {
        getType(): string {
            return 'number';
        }

        convertFrom(val: string): any {
            return +val;
        }

        convertTo(val: any): string {
            return val.toString();
        }
    }

    class ArrayConverter extends TypeConverter {
        private converter: TypeConverter;
        private static SEPARATOR = '-';
        private static SEPARATOR1 = '1-';
        private static SEPARATOR2 = '2-';

        constructor(converter: TypeConverter) {
            super();
            this.converter = converter;
        }

        getType(): string {
            return this.converter.getType() + 'array';
        }

        convertFrom(val: string): any {
            var arr = [];
            if (val.length !== 0) {
                var vals = val.split(ArrayConverter.SEPARATOR1);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(new RegExp(ArrayConverter.SEPARATOR2, 'g'), ArrayConverter.SEPARATOR)));
                    else
                        arr.push(null);
                }
            }
            return arr;
        }

        convertTo(val: any): string {
            var formatArray = [];
            var arr: Array<any> = val;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null)
                    formatArray.push(this.converter.convertTo(arr[i]).replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR2));
            }
            return formatArray.join(ArrayConverter.SEPARATOR1);
        }
    }

    class ConverterFactory {
        private static typeArray: { (): TypeConverter; }[];
        private static keyToConverterList: any;
        private static typeToKeyList: any;

        static init() {
            this.typeArray = [];
            this.typeArray.push(() => new StringConverter());
            this.typeArray.push(() => new BooleanConverter());
            this.typeArray.push(() => new NumberConverter());
            this.keyToConverterList = {};
            this.typeToKeyList = {};
            for (var i = 0; i < this.typeArray.length; i++) {
                this.keyToConverterList[i.toString()] = this.typeArray[i]();
                this.keyToConverterList['a' + i] = new ArrayConverter(this.typeArray[i]());
                this.typeToKeyList[this.typeArray[i]().getType()] = i.toString();
                this.typeToKeyList[new ArrayConverter(this.typeArray[i]()).getType()] = 'a' + i;
            }
        }

        static getKey(type: string) {
            return this.typeToKeyList[type];
        }

        static getKeyFromObject(obj: any) {
            var fullType = typeof obj;
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                var arr: Array<any> = obj;
                var type2 = 'string';
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != null) {
                        type2 = typeof arr[i];
                        break;
                    }
                }
                fullType = type2 + 'array';
            }
            if (!this.typeToKeyList[fullType])
                throw new Error('Invalid type');
            return this.typeToKeyList[fullType];
        }

        static getConverter(key: string): TypeConverter {
            return this.keyToConverterList[key];
        }
    }

    ConverterFactory.init();

    //On popState or hashChange call StateController.navigateLink(window.location.href)
}
