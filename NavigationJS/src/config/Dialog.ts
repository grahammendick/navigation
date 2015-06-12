import State = require('./State');
import IDialog = require('./IDialog');

class Dialog implements IDialog<State, { [index: string]: State }> {
    _states: State[] = [];
    states: { [index: string]: State } = {};
    index: number;
    initial: State;
    key: string;
    title: string;
}
export = Dialog;
