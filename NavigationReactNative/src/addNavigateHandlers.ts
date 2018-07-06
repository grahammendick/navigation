import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native';

var addNavigateHandlers = stateNavigators => {
    var {NavigationModule} = NativeModules;
    var stateNavigators = stateNavigators.forEach ? stateNavigators : [stateNavigators];
    stateNavigators.forEach((stateNavigator, tab) => {
        stateNavigator.onNavigate(() => {
            var {crumbs, title, history} = stateNavigator.stateContext;
            if (!history) {
                var titles = crumbs.map(({title}) => title).concat(title);
                NavigationModule.render(crumbs.length, tab, titles, AppRegistry.getAppKeys()[0]);
            }
        });
    });
    var emitter = new NativeEventEmitter(NavigationModule)
    emitter.addListener('Navigate', ({crumb, tab}) => {
        var stateNavigator = stateNavigators[tab];
        var distance = stateNavigator.stateContext.crumbs.length - crumb + 1;
        if (distance > 0) {
            var url = stateNavigator.getNavigationBackLink(distance);
            stateNavigator.navigateLink(url, undefined, true);
        }
    });
}

export default addNavigateHandlers;