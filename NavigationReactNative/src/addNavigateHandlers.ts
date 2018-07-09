import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native';
import { StateNavigator } from 'navigation';

var addNavigateHandlers = (stateNavigator: StateNavigator | StateNavigator[]) => {
    var {NavigationModule} = NativeModules;
    var stateNavigators = isStateNavigator(stateNavigator) ? [stateNavigator] : stateNavigator;
    stateNavigators.forEach((stateNavigator, tab) => {
        stateNavigator.onNavigate(() => {
            var {crumbs, title, history} = stateNavigator.stateContext;
            if (!history) {
                var titles = crumbs.map(({title}) => title).concat(title);
                NavigationModule.render(crumbs.length, tab, titles, AppRegistry.getAppKeys()[0]);
            }
        });
    });
    new NativeEventEmitter(NavigationModule).addListener('Navigate', ({crumb, tab}) => {
        var stateNavigator = stateNavigators[tab];
        var distance = stateNavigator.stateContext.crumbs.length - crumb + 1;
        if (stateNavigator.canNavigateBack(distance)) {
            var url = stateNavigator.getNavigationBackLink(distance);
            stateNavigator.navigateLink(url, undefined, true);
        }
    });
}

function isStateNavigator(stateNavigator: StateNavigator | StateNavigator[]): stateNavigator is StateNavigator {
    return !!(<StateNavigator> stateNavigator).stateContext;
};

export default addNavigateHandlers;
