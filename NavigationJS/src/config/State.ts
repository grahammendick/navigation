import Dialog = require('./Dialog');
import IState = require('./IState');
import IStateHandler = require('../IStateHandler');
import StateHandler = require('../StateHandler');
import Transition = require('./Transition');

class State implements IState<{ [index: string]: Transition }> {
    _transitions: Transition[] = [];
    transitions: { [index: string]: Transition } = {};
    parent: Dialog;
    index: number;
    id: string;
    key: string;
    defaults: any = {};
    defaultTypes: any = {};
    formattedDefaults: any = {};
    title: string;
    route: string | string[];
    trackCrumbTrail: boolean = true;
    trackTypes: boolean = true;
    stateHandler: IStateHandler = new StateHandler();
    unloading: (state: State, data: any, url: string, unload: () => void, history?: boolean) => void = function (state, data, url, unload) { unload(); };
    navigating: (data: any, url: string, navigate: (asyncData?: any) => void, history?: boolean) => void = function (data, url, navigate) { navigate(); };
    dispose: () => void = function () { };
    navigated: (data: any, asyncData?: any) => void = function (data: any) { };
}
export = State;
