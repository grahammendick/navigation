import Navigation = require('navigation');
import Rx = require('rx');

function navigate(properties) {
    if (properties.action) {
        Navigation.StateController.navigate(properties.action, properties.toData, properties.historyAction);
    } else {
        if (properties.toData) {
            Navigation.StateController.refresh(properties.toData, properties.historyAction);
        } else {
            Navigation.StateController.navigateBack(properties.distance, properties.historyAction);
        }
    }             
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
