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
        dispose: () => void = function () { };
        navigated: (data: any) => void = function (data: any) { };
        navigating: (data: any, url: string, navigate: () => void) => void = function (data, url, navigate) { navigate(); } 
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
                    throw new Error('key is mandatory for a Dialog');
                if (this.dialogs[dialog.key])
                    throw new Error('A Dialog with key ' +  dialog.key + ' already exists');
                this._dialogs.push(dialog);
                this.dialogs[dialog.key] = dialog;
                this.processStates(dialog, dialogObject);
                this.processTransitions(dialog, dialogObject);
                dialog.initial = dialog.states[dialogObject.initial];
                if (!dialogObject.initial)
                    throw new Error('initial is mandatory for a Dialog');
                if (!dialog.initial)
                    throw new Error(dialog.key + ' Dialog\'s initial key of ' + dialogObject.initial + ' does not match a child State key');
            }
            router.addRoutes(this._dialogs);
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
                    throw new Error('key is mandatory for a State');
                if (dialog.states[state.key])
                    throw new Error('A State with key ' + state.key + ' already exists for Dialog ' + dialog.key);
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
                            throw new Error('key is mandatory for a Transition');
                        transition.parent = dialog._states[i];
                        transition.to = dialog.states[transitionObject.to];
                        if (!transitionObject.to)
                            throw new Error('to is mandatory for a Transition');
                        if (!transition.to)
                            throw new Error(dialog._states[i].key + ' State\'s Transition to key of ' + transition.key + ' does not match a sibling State key');
                        if (transition.parent.transitions[transition.key])
                            throw new Error('A Transition with key ' + transition.key + ' already exists for State ' + dialog._states[i].key);
                        transition.parent._transitions.push(transition);
                        transition.parent.transitions[transition.key] = transition;
                    }
                }
            }
        }
    }

    export class NavigationSettings {
        stateIdKey: string = 'c0';
        previousStateIdKey: string = 'c1';
        returnDataKey: string = 'c2';
        crumbTrailKey: string = 'c3';
        applicationPath: string = '';
    }

    export var settings: NavigationSettings = new NavigationSettings();

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
        navigateLink(oldState: State, state: State, url: string);
        getNavigationData(state: State, url: string): any;
        truncateCrumbTrail(state: State, crumbs: Array<Crumb>): Array<Crumb>;
    }

    export class StateHandler implements IStateHandler {
        getNavigationLink(state: State, data: any): string {
            delete data[settings.stateIdKey];
            var routeInfo = router.getRoute(state, data);
            if (routeInfo.route == null)
                return null;
            var query: Array<string> = [];
            for (var key in data) {
                if (!routeInfo.data || routeInfo.data[key] == null)
                    query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
            }
            if (query.length > 0)
                routeInfo.route += '?' + query.join('&');
            return routeInfo.route;
        }

        navigateLink(oldState: State, state: State, url: string) {
            StateController.setStateContext(state, url);
            if (StateContext.url === url)
                historyManager.addHistory(oldState, state, url);
        }

        getNavigationData(state: State, url: string): any {
            var queryIndex = url.indexOf('?');
            var data = router.getData(queryIndex < 0 ? url : url.substring(0, queryIndex)).data;
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
        getData(route: string): { state: State; data: any };
        getRoute(state: State, data: any): { route: string; data: any };
        supportsDefaults: boolean;
        addRoutes(dialogs: Array<Dialog>);
    }

    export class StateRouter implements IRouter {
        router: Navigation.Routing.Router;
        supportsDefaults: boolean = true;

        getData(route: string): { state: State; data: any } {
            var match = this.router.match(route);
            return { state: match.route['_state'], data: this.router.match(route).data };
        }

        getRoute(state: State, data: any): { route: string; data: any } {
            var route: Navigation.Routing.Route = state['_route'];
            var routeData = {};
            for (var i = 0; i < route.params.length; i++) {
                routeData[route.params[i].name] = data[route.params[i].name];
            }
            return { route: route.build(data), data: routeData };
        }

        addRoutes(dialogs: Array<Dialog>) {
            this.router = new Navigation.Routing.Router();
            var states: Array<State> = [];
            for (var i = 0; i < dialogs.length; i++) {
                for (var j = 0; j < dialogs[i]._states.length; j++) {
                    states.push(dialogs[i]._states[j]);
                }
            }
            states.sort((stateA, stateB) => {
                var stateANumber = stateA.route.substring(0, 1) === '{' ? -1 : 0;
                var stateBNumber = stateB.route.substring(0, 1) === '{' ? -1 : 0;
                return stateBNumber - stateANumber;
            });
            for (var i = 0; i < states.length; i++) {
                var state = states[i];
                state['_route'] = this.router.addRoute(state.route, state.formattedDefaults);
                state['_route']['_state'] = state;
            }
        }
    }

    export var router: IRouter = new StateRouter();

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
        static url: string;

        static includeCurrentData(data: any, keys?: Array<string>): any {
            if (!keys) {
                keys = [];
                for (var key in this.data)
                    keys.push(key);
            }
            var newData: any = {};
            for (var i = 0; i < keys.length; i++)
                newData[keys[i]] = this.data[keys[i]];
            for (var key in data)
                newData[key] = data[key];
            return newData;
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
            data[settings.stateIdKey] = state.id;
            if (state.trackCrumbTrail && StateContext.state)
                data[settings.previousStateIdKey] = StateContext.state.id;
            navigationData = NavigationData.clone(navigationData);
            NavigationData.setDefaults(navigationData, state.defaults);
            for (var key in navigationData) {
                if (navigationData[key] != null && navigationData[key].toString()
                    && (!router.supportsDefaults || navigationData[key] !== state.defaults[key]))
                    data[key] = this.formatURLObject(key, navigationData[key], state);
            }
            if (state.trackCrumbTrail && StateContext.state) {
                var returnDataString = this.formatReturnData(StateContext.state, returnData);
                if (returnDataString)
                    data[settings.returnDataKey] = returnDataString;
            }
            if (this.crumbTrail && state.trackCrumbTrail)
                data[settings.crumbTrailKey] = this.crumbTrail;
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
            return ConverterFactory.getConverter(converterKey).convertFrom(this.decodeUrlValue(urlValue));
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
        private static NAVIGATE_HANDLER_ID = 'navigateHandlerId';
        private static navigateHandlerId: number = 1;
        private static navigateHandlers: { [index: string]: (oldState: State, state: State, data: any) => void } = {};

        static setStateContext(state: State, url: string) {
            var oldState = StateContext.state;
            try {
                StateContext.state = state;
                StateContext.url = url;
                StateContext.dialog = state.parent;
                var data = state.stateHandler.getNavigationData(state, url);
                StateContext.previousState = CrumbTrailManager.getState(data[settings.previousStateIdKey]);
                StateContext.previousDialog = null;
                if (StateContext.previousState)
                    StateContext.previousDialog = StateContext.previousState.parent;
                CrumbTrailManager.returnData = {};
                if (data[settings.returnDataKey])
                    CrumbTrailManager.returnData = CrumbTrailManager.parseReturnData(data[settings.returnDataKey], StateContext.previousState);
                CrumbTrailManager.crumbTrail = data[settings.crumbTrailKey];
                StateContext.data = this.parseData(data, state);
                CrumbTrailManager.buildCrumbTrail();
                this.crumbs = CrumbTrailManager.getCrumbs(true);
            } catch (e) {
                throw new Error('The Url is invalid\n' + e.message);
            }
            if (oldState && oldState !== state)
                oldState.dispose();
            state.navigated(StateContext.data);
            for (var id in this.navigateHandlers) {
                if (url === StateContext.url)
                    this.navigateHandlers[id](oldState, state, StateContext.data);
            }
        }

        static onNavigate(handler: (oldState: State, state: State, data: any) => void) {
            if (!handler[this.NAVIGATE_HANDLER_ID]) {
                var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
                handler[this.NAVIGATE_HANDLER_ID] = id;
                this.navigateHandlers[id] = handler;
            }
        }

        static offNavigate(handler: (oldState: State, state: State, data: any) => void) {
            delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
            delete handler[this.NAVIGATE_HANDLER_ID];
        } 

        static navigate(action: string, toData?: any) {
            var url = this.getNavigationLink(action, toData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this._navigateLink(url, this.getNextState(action));
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
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this._navigateLink(url, this.getCrumb(distance).state);
        }

        static getNavigationBackLink(distance: number): string {
            return this.getCrumb(distance).navigationLink;
        }

        static refresh(toData?: any) {
            var url = this.getRefreshLink(toData);
            if (url == null)
                throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
            this._navigateLink(url, StateContext.state);
        }

        static getRefreshLink(toData?: any): string {
            return CrumbTrailManager.getRefreshHref(toData);
        }

        static navigateLink(url: string) {
            try {
                var state = router.getData(url.split('?')[0]).state;
            } catch (e) {
                throw new Error('The Url is invalid\n' + e.message);
            }
            this._navigateLink(url, state);
        }

        private static _navigateLink(url: string, state: State) {
            try {
                var oldUrl = StateContext.url;
                var oldState = StateContext.state;
                var data = state.stateHandler.getNavigationData(state, url);
                data = this.parseData(data, state);
            } catch (e) {
                throw new Error('The Url is invalid\n' + e.message);
            }
            state.navigating(data, url, () => {
                if (oldUrl === StateContext.url)
                    state.stateHandler.navigateLink(oldState, state, url);
            });
        }

        private static parseData(data: any, state: State): any {
            var newData = {};
            for (var key in data) {
                if (key !== settings.previousStateIdKey && key !== settings.returnDataKey && key !== settings.crumbTrailKey)
                    newData[key] = CrumbTrailManager.parseURLString(key, data[key], state);
            }
            NavigationData.setDefaults(newData, state.defaults);
            return newData;
        }

        static getNextState(action: string): State {
            var nextState: State = null;
            if (StateContext.state && StateContext.state.transitions[action])
                nextState = StateContext.state.transitions[action].to;
            if (!nextState && StateInfoConfig.dialogs[action])
                nextState = StateInfoConfig.dialogs[action].initial;
            if (!nextState)
                throw new Error('The action parameter must be a Dialog key or a Transition key that is a child of the current State');
            return nextState;
        }

        private static getCrumb(distance: number): Crumb {
            if (distance > this.crumbs.length || distance <= 0)
                throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.crumbs.length + ')');
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
            if (val !== 'true' && val !== 'false')
                throw Error(val + ' is not a valid boolean');
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
            if (isNaN(+val))
                throw Error(val + ' is not a valid number');
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
            var type2: string;
            if (Object.prototype.toString.call(obj) === '[object Array]') {
                var arr: Array<any> = obj;
                type2 = 'string';
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != null) {
                        type2 = typeof arr[i];
                        break;
                    }
                }
                fullType = type2 + 'array';
            }
            if (!this.typeToKeyList[fullType])
                throw new Error('No TypeConverter found for ' + !type2 ? fullType : type2);
            return this.typeToKeyList[fullType];
        }

        static getConverter(key: string): TypeConverter {
            return this.keyToConverterList[key];
        }
    }

    ConverterFactory.init();

    export function start(url?: string) {
        StateController.navigateLink(url ? url : historyManager.getCurrentUrl());
    }

    export interface IHistoryManager {
        addHistory(oldState: State, state: State, url: string);
        getCurrentUrl(): string;
        getHref(url: string): string;
        getUrl(anchor: HTMLAnchorElement): string;
    }

    var navigateHistory = () => {
        if (StateContext.url === historyManager.getCurrentUrl())
            return;
        StateController.navigateLink(historyManager.getCurrentUrl());
    }

    export class HashHistoryManager implements IHistoryManager {
        private disabled: boolean = false;

        constructor(disable?: boolean) {
            this.disabled = !!disable || (typeof window === 'undefined') || !('onhashchange' in window);
            if (!this.disabled) {
                if (window.addEventListener) {
                    window.removeEventListener('hashchange', navigateHistory);
                    window.addEventListener('hashchange', navigateHistory);
                } else {
                    window.detachEvent('onhashchange', navigateHistory);
                    window.attachEvent('onhashchange', navigateHistory);
                }
            }
        }

        addHistory(oldState: State, state: State, url: string) {
            if (state.title)
                document.title = state.title;
            if (!this.disabled && location.hash.substring(1) !== url)
                location.hash = url;
        }

        getCurrentUrl(): string {
            return location.hash.substring(1);
        }

        getHref(url: string): string {
            if (!url)
                throw new Error('The Url is invalid');
            return '#' + url;
        }

        getUrl(anchor: HTMLAnchorElement) {
            return anchor.hash.substring(1);
        }
    }

    export class HTML5HistoryManager implements IHistoryManager {
        constructor() {
            window.removeEventListener('popstate', navigateHistory);
            window.addEventListener('popstate', navigateHistory);
        }

        addHistory(oldState: State, state: State, url: string) {
            if (state.title)
                document.title = state.title;
            url = settings.applicationPath + url;
            if (location.pathname + location.search !== url)
                window.history.pushState(null, null, url);
        }

        getCurrentUrl(): string {
            return location.pathname.substring(settings.applicationPath.length) + location.search;
        }

        getHref(url: string): string {
            if (!url)
                throw new Error('The Url is invalid');
            return settings.applicationPath + url;
        }

        getUrl(anchor: HTMLAnchorElement) {
            return anchor.pathname.substring(settings.applicationPath.length) + anchor.search;
        }
    }

    export var historyManager: IHistoryManager = new HashHistoryManager();
}
