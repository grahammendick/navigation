import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native';
import { StateNavigator, Crumb } from 'navigation';

var addNavigateHandlers = (stateNavigator: StateNavigator | StateNavigator[]) => {
    var {NavigationModule} = NativeModules;
    var stateNavigators = isStateNavigator(stateNavigator) ? [stateNavigator] : stateNavigator;
    stateNavigators.forEach((stateNavigator, tab) => {
        stateNavigator.onNavigate(() => {
            var {crumbs, history, oldState, oldData, oldUrl} = stateNavigator.stateContext;
            var {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
            if (!history && crumbs.length !== oldCrumbs.length) {
                var {state, data, title, oldData, nextCrumb} = stateNavigator.stateContext;
                var titles = crumbs.map(({title}) => title).concat(title);
                var appKey = AppRegistry.getAppKeys()[0];
                if (oldCrumbs.length < crumbs.length) {
                    var {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
                    var exitAnim = oldState.getCrumbStyle && oldState.getCrumbStyle(true, oldData, oldCrumbs, nextState, nextData);
                    var enterAnim = state.getUnmountStyle && state.getUnmountStyle(false, data, crumbs);
                } else {
                    var nextCrumb = new Crumb(oldData, oldState, null, null, false);
                    var {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
                    var exitAnim = oldState.getUnmountStyle && oldState.getUnmountStyle(true, oldData, oldCrumbs);
                    var enterAnim = state.getCrumbStyle && state.getCrumbStyle(false, data, crumbs, nextState, nextData);
                }
                NavigationModule.render(crumbs.length, tab, titles, appKey, enterAnim, exitAnim);
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
