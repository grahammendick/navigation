import Dialog = require('./Dialog');
import CrumbTrailManager = require('../CrumbTrailManager');
import ReturnDataManager = require('../ReturnDataManager');
import settings = require('../settings');
import State = require('./State');
import Transition = require('./Transition');

class StateInfoConfig {
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
                throw new Error('A Dialog with key ' + dialog.key + ' already exists');
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
        settings.router.addRoutes(this._dialogs);
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
                state.formattedDefaults[key] = ReturnDataManager.formatURLObject(key, state.defaults[key], state);
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
export = StateInfoConfig;
