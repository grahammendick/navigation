import { StateNavigator } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    constructor(stateNavigator: StateNavigator) {
        super(stateNavigator, stateNavigator.historyManager);
        this.stateContext = stateNavigator.stateContext;
    }
}
export default AsyncStateNavigator;
