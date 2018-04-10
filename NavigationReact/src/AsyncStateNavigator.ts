import NavigationHandler from './NavigationHandler';
import { StateNavigator, StateContext, HashHistoryManager } from 'navigation';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler;
    private stateNavigator;

    constructor(navigationHandler: NavigationHandler, stateNavigator: StateNavigator, stateContext: StateContext) {
        var inertHistoryManager = new HashHistoryManager();
        inertHistoryManager.init = () => {};
        super(stateNavigator, inertHistoryManager);
        this.navigationHandler = navigationHandler;
        this.stateNavigator = stateNavigator;
        this.stateContext = stateContext;
        this.historyManager = stateNavigator.historyManager;
        this.configure = stateNavigator.configure.bind(stateNavigator);
        this.onBeforeNavigate = stateNavigator.onBeforeNavigate.bind(stateNavigator);
        this.offBeforeNavigate = stateNavigator.offBeforeNavigate.bind(stateNavigator);
        this.onNavigate = stateNavigator.onNavigate.bind(stateNavigator);
        this.offNavigate = stateNavigator.offNavigate.bind(stateNavigator);
    }

    navigate(stateKey: string, navigationData?: any, historyAction?: 'add' | 'replace' | 'none', defer?: boolean) {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction, false, defer);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false, suspendNavigation, defer = false) {
        this.stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            this.navigationHandler.setState(() => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator, stateContext); 
                var { oldState, state, data, asyncData } = stateContext;
                return { context: { oldState, state, data, asyncData, stateNavigator: asyncNavigator } };
            }, () => {
                resumeNavigation();
            });
        });
    }
}
export default AsyncStateNavigator;