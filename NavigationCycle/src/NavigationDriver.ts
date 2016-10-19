import LinkUtility from './LinkUtility';
import { StateNavigator } from 'navigation';
import NavigationBackLink from './NavigationBackLink';
import NavigationLink from './NavigationLink';
import RefreshLink from './RefreshLink';
import * as Rx from 'rx';

function navigate(e, stateNavigator: StateNavigator) {
    var navigationData = LinkUtility.getData(stateNavigator, e.navigationData, e.includeCurrentData, e.currentDataKeys);
    if (e.action)
        stateNavigator.navigate(e.state, navigationData, e.historyAction);
    if (!e.action && e.navigationData)
        stateNavigator.refresh(navigationData, e.historyAction);
    if (e.distance)
        stateNavigator.navigateBack(e.distance, e.historyAction);
    if (e.url)
        stateNavigator.navigateLink(e.url, e.historyAction);
}

var NavigationDriver = function(url) {
    return function(navigate$) {
        var stateNavigator: StateNavigator;
        var navigated$ = new Rx.ReplaySubject(1);
        navigate$.subscribe(e => {
            if (e.stateNavigator) {
                stateNavigator = e.stateNavigator;
                stateNavigator.onNavigate(() => navigated$.onNext({
                    oldState: stateNavigator.stateContext.oldState,
                    oldData: stateNavigator.stateContext.oldData,
                    previousState: stateNavigator.stateContext.previousState,
                    previousData: stateNavigator.stateContext.previousData,
                    state: stateNavigator.stateContext.state,
                    data: stateNavigator.stateContext.data,
                    crumbs: stateNavigator.stateContext.crumbs
                }));
                stateNavigator.start(url);
            }
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = stateNavigator.historyManager.getUrl(e.target);
                    stateNavigator.navigateLink(link, e.target.historyAction);
                }
            } else {
                navigate(e, stateNavigator);
            }
        });
        return navigated$;
    };
}
export default NavigationDriver;
