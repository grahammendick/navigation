import LinkUtility = require('./LinkUtility');
import Navigation = require('navigation');
import NavigationBackLink = require('./NavigationBackLink');
import NavigationLink = require('./NavigationLink');
import RefreshLink = require('./RefreshLink');
import Rx = require('rx');

function navigate(e, stateController: Navigation.StateController) {
    var toData = LinkUtility.getData(stateController, e.toData, e.includeCurrentData, e.currentDataKeys);
    if (e.action)
        stateController.navigate(e.state, toData, e.historyAction);
    if (!e.action && e.toData)
        stateController.refresh(toData, e.historyAction);
    if (e.distance)
        stateController.navigateBack(e.distance, e.historyAction);
    if (e.url)
        stateController.navigateLink(e.url, e.historyAction);
}

var NavigationDriver = function(url) {
    return function(navigate$) {
        var stateController: Navigation.StateController;
        var navigated$ = new Rx.ReplaySubject(1);
        navigate$.subscribe(e => {
            if (e.stateController) {
                stateController = e.stateController;
                stateController.onNavigate(() => navigated$.onNext({
                    oldState: stateController.stateContext.oldState,
                    oldData: stateController.stateContext.oldData,
                    previousState: stateController.stateContext.previousState,
                    previousData: stateController.stateContext.previousData,
                    state: stateController.stateContext.state,
                    data: stateController.stateContext.data,
                    crumbs: stateController.stateContext.crumbs
                }));
                stateController.start(url);
            }
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = stateController.historyManager.getUrl(e.target);
                    stateController.navigateLink(link, e.target.historyAction);
                }
            } else {
                navigate(e, stateController);
            }
        });
        return navigated$;
    };
}
export = NavigationDriver;
