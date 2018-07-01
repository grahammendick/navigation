import {AppRegistry, NativeEventEmitter, NativeModules} from 'react-native';

var {NavigationMotion} = NativeModules;
var emitter = new NativeEventEmitter(NavigationMotion)

var addNavigateHandler = (stateNavigator, tab) => {
    stateNavigator.onNavigate(() => {
        var {crumbs, title, history} = stateNavigator.stateContext;
        if (!history) {
            var titles = crumbs.map(({title}) => title).concat(title);
            NavigationMotion.render(crumbs.length, tab, titles, AppRegistry.getAppKeys()[0]);
        }
    });        
};

var onNavigate = navigationHandler => emitter.addListener('Navigate', navigationHandler);

export {addNavigateHandler, onNavigate};

