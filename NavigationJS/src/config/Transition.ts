import State = require('./State');

class Transition {
    to: State;
    parent: State;
    index: number;
    key: string;
}
export = Transition;
