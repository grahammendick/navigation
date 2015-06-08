import Dialog = require('./Dialog');
import IState = require('./IState');
import IStateHandler = require('../IStateHandler');
import StateHandler = require('../StateHandler');
import Transition = require('./Transition');

class State implements IState<{ [index: string]: Transition }> {
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
    unloading: (state: State, data: any, url: string, unload: () => void, history: boolean) => void 
        = function (state, data, url, unload, history) { unload(); };
    navigating: (data: any, url: string, navigate: () => void, history: boolean) => void 
        = function (data, url, navigate, history) { navigate(); };
    dispose: () => void = function () { };
    navigated: (data: any) => void = function (data: any) { };
}
export = State;
