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
    unloading: (state: State, url: string, unload: () => void) => void = function (state, url, unload) { unload(); };
    navigating: (data: any, url: string, navigate: () => void) => void = function (data, url, navigate) { navigate(); };
    dispose: () => void = function () { };
    navigated: (data: any) => void = function (data: any) { };
}
export = State;
