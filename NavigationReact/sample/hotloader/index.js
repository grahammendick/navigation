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
            var dialogProp = prefixes[i] + 'dialog';
            var stateProp = prefixes[i] + 'state';
            var dialog = Navigation.StateContext[dialogProp];
            var state = Navigation.StateContext[stateProp];
            if (state) {
                dialog = Navigation.StateInfoConfig.dialogs[dialog.key];
                Navigation.StateContext[dialogProp] = dialog;
                Navigation.StateContext[stateProp] = dialog.states[state.key];       
            }
        }
        var currentData = Navigation.StateContext.includeCurrentData({});
        Navigation.StateController.refresh(currentData);
    })
}
