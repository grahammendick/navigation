import Navigation = require('navigation');
import Rx = require('rx');

function navigate(e) {
    if (e.action)
        Navigation.StateController.navigate(e.action, e.toData, e.historyAction);
    if (!e.action && e.toData)
        Navigation.StateController.refresh(e.toData, e.historyAction);
    if (e.distance)
        Navigation.StateController.navigateBack(e.distance, e.historyAction);
}

var NavigationDriver = (url) => {
    return (navigate$) => {
        var started = false;
        navigate$.subscribe(e => {
            if (!started) {
                Navigation.start(url);
                started = true;
                return;
            }
            if (e.target) {
                if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                    e.preventDefault();
                    var link = Navigation.settings.historyManager.getUrl(e.target);
                    Navigation.StateController.navigateLink(link);
                }
            } else {
                navigate(e);
            }
        });
        var navigated$ = new Rx.ReplaySubject(1);
        Navigation.StateController.onNavigate(() => {
            navigated$.onNext(Navigation.StateContext);
        })
        navigated$['isolateSource'] = (NavigationSource, key) => (
            NavigationSource.filter((navigated) => navigated.state.parent.index + '-' + navigated.state.index === key)
        )
        return navigated$;
    };
}
export = NavigationDriver;
