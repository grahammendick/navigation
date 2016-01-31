import Navigation = require('navigation');
import Rx = require('rx');

function navigate(e) {
    var historyAction = e.historyAction;
    if (typeof historyAction === 'string')
        historyAction = Navigation.HistoryAction[historyAction];
    if (e.action)
        Navigation.StateController.navigate(e.action, e.toData, historyAction);
    if (!e.action && e.toData)
        Navigation.StateController.refresh(e.toData, historyAction);
    if (e.distance)
        Navigation.StateController.navigateBack(e.distance, historyAction);
    if (e.url)
        Navigation.StateController.navigateLink(e.url, false, historyAction);
}

function isolate(NavigationSource, key) {
    var navigated$ = NavigationSource.navigated
        .filter((context) => context.state.parent.index + '-' + context.state.index === key);
    return {
        navigated: navigated$    
    };
}

var NavigationDriver = function(url) {
    return function(navigate$) {
        navigate$.subscribe(e => {
            if (!Navigation.StateContext.state)
                Navigation.start(url);
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = Navigation.settings.historyManager.getUrl(e.target);
                    var historyAction = e.target.historyAction;
                    if (typeof historyAction === 'string')
                        historyAction = Navigation.HistoryAction[historyAction];
                    Navigation.StateController.navigateLink(link, false, historyAction);
                }
            } else {
                navigate(e);
            }
        });
        var navigated$ = new Rx.ReplaySubject(1);
        Navigation.StateController.onNavigate(() => navigated$.onNext(Navigation.StateContext));
        return {
            navigated: navigated$,
            isolateSource: isolate
        };
    };
}
export = NavigationDriver;
