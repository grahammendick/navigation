import { StateNavigator } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    constructor(stateNavigator: StateNavigator) {
        super(stateNavigator, stateNavigator.historyManager);
        this.stateContext = stateNavigator.stateContext;
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'replace') {
        throw Error(`__rscNavigationLink;${url};${historyAction}`);
    }
}
export default AsyncStateNavigator;
