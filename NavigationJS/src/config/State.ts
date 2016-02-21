import IState = require('./IState');
import StateHandler = require('./StateHandler');

class State implements IState {
    key: string;
    defaults: any = {};
    defaultTypes: any = {};
    formattedDefaults: any = {};
    formattedArrayDefaults: { [index: string]: string[] } = {};
    title: string;
    route: string | string[];
    trackCrumbTrail: boolean = false;
    crumbTrailKey: string = 'crumb';
    trackTypes: boolean = true;
    stateHandler: StateHandler = new StateHandler();
    unloading: (state: State, data: any, url: string, unload: () => void, history: boolean) => void = function (state, data, url, unload) { unload(); };
    navigating: (data: any, url: string, navigate: (asyncData?: any) => void, history: boolean) => void = function (data, url, navigate) { navigate(); };
    dispose: () => void = function () { };
    navigated: (data: any, asyncData?: any) => void = function (data: any) { };
}
export = State;
