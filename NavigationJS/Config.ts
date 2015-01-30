module Navigation {
    export class Dialog {
        states: Array<State> = [];
        _states: { [index: string]: State } = {};
        index: number;
        initial: State;
        key: string;
        title: string;
    }

    export class State {
        transitions: Array<Transition> = [];
        _transitions: { [index: string]: Transition } = {};
        parent: Dialog;
        index: number;
        id: string;
        key: string;
        title: string;
        route: string;
        trackCrumbTrail: boolean = true;
        stateHandler: IStateHandler = new StateHandler();
    }

    export class Transition {
        to: State;
        parent: State;
        index: number;
        key: string;
    }

    export class StateInfoConfig {
        static dialogs: Array<Dialog> = [];
        static _dialogs: { [index: string]: Dialog } = {};
        static build(dialogs: Array<any>) {
            for (var i = 0; i < dialogs.length; i++) {
                var dialogObject = dialogs[i];
                var dialog = new Dialog();
                dialog.index = i;
                for (var key in dialogObject) {
                    if (key !== 'states')
                        dialog[key] = dialogObject[key];
                }
                this.dialogs.push(dialog);
                this._dialogs[dialog.key] = dialog;
                this.processStates(dialog, dialogObject);
                this.processTransitions(dialog, dialogObject);
                dialog.initial = dialog._states[dialogObject.initial];
            }
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
                dialog.states.push(state);
                dialog._states[state.key] = state;
            }
        }

        private static processTransitions(dialog: Dialog, dialogObject: any) {
            for (var i = 0; i < dialogObject.states.length; i++) {
                if (dialogObject.states[i].transitions) {
                    for (var j = 0; j < dialogObject.states[i].transitions.length; j++) {
                        var transitionObject = dialogObject.states[i].transitions[j];
                        var transition = new Transition();
                        transition.key = transitionObject.key;
                        transition.parent = dialog.states[i];
                        transition.to = dialog._states[transitionObject.to];
                        transition.parent.transitions.push(transition);
                        transition.parent._transitions[transition.key] = transition;
                    }
                }
            }
        }
    }
}
