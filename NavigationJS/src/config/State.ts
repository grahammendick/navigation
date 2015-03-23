import Dialog = require('Dialog');
import Transition = require('Transition');
import IStateHandler = require('IStateHandler');
import StateHandler = require('StateHandler');

class State {
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
export = State;
