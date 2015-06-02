import ITransition = require('./ITransition');
import State = require('./State');

class Transition implements ITransition<State> {
    to: State;
    parent: State;
    index: number;
    key: string;
}
export = Transition;
