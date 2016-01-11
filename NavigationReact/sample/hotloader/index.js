var Navigation = require('navigation');
var StateInfo = require('./StateInfo');
var StateNavigator = require('./StateNavigator');

StateInfo.configureStateInfo();
StateNavigator.configureStateNavigator();
Navigation.start();

if (module.hot) {
    module.hot.accept(['./StateInfo', './StateNavigator'], function() {
        require('./StateInfo').configureStateInfo();
        require('./StateNavigator').configureStateNavigator();
        var prefixes = ['', 'old', 'previous'];
        for(var i = 0; i < prefixes.length; i++) {
            var dialog = prefixes[i] + 'dialog', state = prefixes[i] + 'state';
            if (Navigation.StateContext[state]) {
                Navigation.StateContext[dialog] = Navigation.StateInfoConfig.dialogs[Navigation.StateContext[dialog].key];
                Navigation.StateContext[state] = Navigation.StateContext[dialog].states[Navigation.StateContext[state].key];       
            }
        }
        Navigation.StateController.refresh(Navigation.StateContext.includeCurrentData({}));
    })
}
