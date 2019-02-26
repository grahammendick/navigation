import { AppRegistry, NativeEventEmitter, NativeModules } from 'react-native';
import { StateNavigator, Crumb } from 'navigation';

var addNavigateHandlers = (stateNavigator: StateNavigator | StateNavigator[]) => {
    var {NavigationModule} = NativeModules;
    var stateNavigators = isStateNavigator(stateNavigator) ? [stateNavigator] : stateNavigator;
    stateNavigators.forEach((stateNavigator, tab) => {
        stateNavigator.onNavigate(() => {
            var {history, oldState} = stateNavigator.stateContext;
            if (!oldState || history)
                return; 
            var {state, data, title, oldData, oldUrl, crumbs, nextCrumb} = stateNavigator.stateContext;
            var appKey = AppRegistry.getAppKeys()[0];
            var titles = crumbs.map(({data, title}) => data.sceneTitle || title).concat(data.sceneTitle || title);
            var {crumbs: oldCrumbs} = stateNavigator.parseLink(oldUrl);
            if (oldCrumbs.length < crumbs.length) {
                var {state: nextState, data: nextData} = crumbs.concat(nextCrumb)[oldCrumbs.length + 1];
                var enterAnim = state.getUnmountStyle && state.getUnmountStyle(true, data, crumbs);
                var exitAnim = oldState.getCrumbStyle && oldState.getCrumbStyle(false, oldData, oldCrumbs, nextState, nextData);
                var sharedElements = state.getSharedElements && state.getSharedElements(data, crumbs);
            }
            if (crumbs.length < oldCrumbs.length) {
                var nextCrumb = new Crumb(oldData, oldState, null, null, false);
                var {state: nextState, data: nextData} = oldCrumbs.concat(nextCrumb)[crumbs.length + 1];
                var enterAnim = state.getCrumbStyle && state.getCrumbStyle(true, data, crumbs, nextState, nextData);
                var exitAnim = oldState.getUnmountStyle && oldState.getUnmountStyle(false, oldData, oldCrumbs);
                var oldSharedElements = oldState.getSharedElements && oldState.getSharedElements(oldData, oldCrumbs);
            }
            NavigationModule.render(crumbs.length, tab, titles, appKey, sharedElements, oldSharedElements, enterAnim, exitAnim);
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
