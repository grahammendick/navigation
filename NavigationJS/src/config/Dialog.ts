import State = require('State');

class Dialog {
    _states: Array<State> = [];
    states: { [index: string]: State } = {};
    index: number;
    initial: State;
    key: string;
    title: string;
}
export = Dialog;
