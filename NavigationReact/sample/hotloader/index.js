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
            var state = Navigation.StateContext[prefixes[i] + 'state'];
            if (state) {
                var dialog = Navigation.StateInfoConfig.dialogs[state.parent.key];
                Navigation.StateContext[prefixes[i] + 'dialog'] = dialog;
                Navigation.StateContext[prefixes[i] + 'state'] = dialog.states[state.key];
            }
        }
        var currentData = Navigation.StateContext.includeCurrentData({});
        Navigation.StateController.refresh(currentData);
    })
}
