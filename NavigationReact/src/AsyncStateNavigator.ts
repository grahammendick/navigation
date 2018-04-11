import NavigationHandler from './NavigationHandler';
import { StateNavigator, StateContext, HTML5HistoryManager } from 'navigation';
import * as ReactDOM from 'react-dom';

class AsyncStateNavigator extends StateNavigator {
    private navigationHandler;
    private stateNavigator;

    constructor(navigationHandler: NavigationHandler, stateNavigator: StateNavigator, stateContext: StateContext) {
        var inertHistoryManager = new HTML5HistoryManager();
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
        this.navigateLink(url, historyAction, false, undefined, defer);
    }

    navigateLink(url: string, historyAction: 'add' | 'replace' | 'none' = 'add', history = false,
        suspendNavigation: (stateContext: StateContext, resumeNavigation: () => void) => void = (_, resumeNavigation) => resumeNavigation(), defer = false) {
        this.stateNavigator.navigateLink(url, historyAction, history, (stateContext, resumeNavigation) => {
            suspendNavigation(stateContext, () => {
                this.suspendNavigation(stateContext, resumeNavigation, defer);
            })
        });
    }

    private suspendNavigation(stateContext, resumeNavigation, defer) {
        defer = defer && ReactDOM.unstable_deferredUpdates;
        var { oldState, state, data, asyncData } = stateContext;
        if (defer)
            this.navigationHandler.setState(({ context }) => ({ context: { ...context, nextState: state, nextData: data } }));
        var wrapDefer = setState => defer ? ReactDOM.unstable_deferredUpdates(() => setState()) : setState();
        wrapDefer(() => {
            this.navigationHandler.setState(() => {
                var asyncNavigator = new AsyncStateNavigator(this.navigationHandler, this.stateNavigator, stateContext);
                return { context: { oldState, state, data, asyncData, nextState: null, nextData: {}, stateNavigator: asyncNavigator } };
            }, () => {
                resumeNavigation();
            });
        });
    }
}
export default AsyncStateNavigator;