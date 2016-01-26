// Should take in anchors and wrap navigate, refresh and back StateController functions
// queryable navigated stream, different events, disposing, navigated etc.
import Navigation = require('navigation');
declare var Rx: any;

var NavigationDriver = (url) => {
    return (navigate$) => {
        navigate$.subscribe(e => {
            if (!e.ctrlKey && !e.shiftKey && !e.metaKey && !e.altKey && !e.button) {
                e.preventDefault();
                var link = Navigation.settings.historyManager.getUrl(e.target);
                Navigation.StateController.navigateLink(link);
            }
        });
        var navigated$ = new Rx.BehaviorSubject();
        for(var dialogKey in Navigation.StateInfoConfig.dialogs) {
            var dialog = Navigation.StateInfoConfig.dialogs[dialogKey];
            for(var stateKey in dialog.states) {
                ((state) => state.navigated = (data) => {
                    navigated$.onNext({ 
                        state: state,
                        data: data
                    });
                })(dialog.states[stateKey]);
            }
        }
        Navigation.start(url);
        navigated$.isolateSource = (NavigationSource, key) => (
            NavigationSource.filter((navigated) => navigated.state.parent.index + '-' + navigated.state.index === key)
        )
        return navigated$;
    };
}
export = NavigationDriver;
