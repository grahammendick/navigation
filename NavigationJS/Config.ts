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
        static _dialogs: Array<Dialog> = [];
        static dialogs: { [index: string]: Dialog } = {};
        static build(dialogs: Array<any>) {
            for (var i = 0; i < dialogs.length; i++) {
                var dialogObject = dialogs[i];
                var dialog = new Dialog();
                dialog.index = i;
                for (var key in dialogObject) {
                    if (key !== 'states')
                        dialog[key] = dialogObject[key];
                }
                this._dialogs.push(dialog);
                this.dialogs[dialog.key] = dialog;
                this.processStates(dialog, dialogObject);
                this.processTransitions(dialog, dialogObject);
                dialog.initial = dialog.states[dialogObject.initial];
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
                        transition.key = transitionObject.key;
                        transition.parent = dialog._states[i];
                        transition.to = dialog.states[transitionObject.to];
                        transition.parent._transitions.push(transition);
                        transition.parent.transitions[transition.key] = transition;
                    }
                }
            }
        }
    }
}
