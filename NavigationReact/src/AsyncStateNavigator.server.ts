import { StateContext, StateNavigator, State } from 'navigation';

class AsyncStateNavigator {
    stateContext: StateContext;
    states: { [index: string]: State };
    constructor(stateNavigator: StateNavigator) {
        this.stateContext = stateNavigator.stateContext;
        this.states = stateNavigator.states;
    }
}
export default AsyncStateNavigator;
