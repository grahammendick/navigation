import NavigationHandler from './NavigationHandler';
import { StateNavigator, HashHistoryManager } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler;
    private stateNavigator;

    constructor(navigationHandler: NavigationHandler, stateNavigator: StateNavigator) {
        var inertHistoryManager = new HashHistoryManager();
        inertHistoryManager.init = () => {};
        super(stateNavigator, inertHistoryManager);
        this.navigationHandler = navigationHandler;
        this.stateNavigator = stateNavigator;
        this.historyManager = stateNavigator.historyManager;
    }

    navigate(stateKey: string, navigationData?: any, historyAction?: 'add' | 'replace' | 'none', defer?: boolean) {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction, false, defer);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false, defer = false) {
        super.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            this.setState(() => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator); 
                asyncNavigator.stateContext = stateContext;
            }, () => {
                resumeNavigation();
            });
        });
    }
}
export default AsyncStateNavigator;