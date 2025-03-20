import { StateNavigator } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    constructor(stateNavigator: StateNavigator) {
        super(stateNavigator, stateNavigator.historyManager);
        this.stateContext = stateNavigator.stateContext;
    }

    navigate<StateKey extends string>(stateKey: StateKey, navigationData?: any, historyAction: 'add' | 'replace' | 'none' = 'replace'): void {
        const url = super.getNavigationLink(stateKey, navigationData)
        throw Error(`navigate;${url};${historyAction}`);
    }

    navigateBack(distance: number, historyAction: 'add' | 'replace' | 'none' = 'replace'): void {
        throw Error(`navigateBack;${distance};${historyAction}`);
    }

    refresh(navigationData?: any, historyAction: 'add' | 'replace' | 'none' = 'replace'): void {
        const url = super.getRefreshLink(navigationData)
        throw Error(`refresh;${url};${historyAction}`);
    }
}
export default AsyncStateNavigator;
