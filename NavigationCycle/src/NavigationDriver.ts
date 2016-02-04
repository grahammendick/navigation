import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');
import Rx = require('rx');

function navigate(e, stateController) {
    var historyAction = LinkUtility.getHistoryAction(e);
    if (e.action)
        stateController.navigate(e.action, e.toData, historyAction);
    if (!e.action && e.toData)
        stateController.refresh(e.toData, historyAction);
    if (e.distance)
        stateController.navigateBack(e.distance, historyAction);
    if (e.url)
        stateController.navigateLink(e.url, false, historyAction);
}

function isolate(NavigationSource, key) {
    var navigated$ = NavigationSource.navigated
        .filter((context) => context.state.parent.index + '-' + context.state.index === key);
    return {
        navigated: navigated$,
        navigationBackLink: NavigationSource.navigationBackLink, 
        navigationLink: NavigationSource.navigationLink,
        refreshLink: NavigationSource.refreshLink 
    };
}

var NavigationDriver = function(url) {
    return function(navigate$) {
        var stateController;
        var navigated$ = new Rx.ReplaySubject(1);
        navigate$.subscribe(e => {
            if (e.stateController) {
                stateController = e.stateController;
                stateController.onNavigate(() => navigated$.onNext({
                        state: stateController.stateContext.state,
                        data: stateController.stateContext.data
                    }));
                stateController.start(url);
            }
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = stateController.settings.historyManager.getUrl(e.target);
                    stateController.navigateLink(link, false, LinkUtility.getHistoryAction(e.target));
                }
            } else {
                navigate(e, stateController);
            }
        });
        return {
            navigated: navigated$,
            isolateSource: isolate,
            navigationBackLink: (properties, children) => NavigationBackLink(stateController, properties, children),
            navigationLink: (properties, children) => NavigationLink(stateController, properties, children),
            refreshLink: (properties, children) => RefreshLink(stateController, properties, children)
        };
    };
}
export = NavigationDriver;
