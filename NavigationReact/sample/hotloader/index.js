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
        var contextProps = [
            { state: 'state', dialog: 'dialog'}, 
            { state: 'oldState', dialog: 'oldDialog'}, 
            { state: 'previousState', dialog: 'previousDialog'} 
        ];
        for(var i = 0; i < contextProps.length; i++) {
            var state = Navigation.StateContext[contextProps[i].state];
            if (state) {
                var dialog = Navigation.StateInfoConfig.dialogs[state.parent.key];
                Navigation.StateContext[contextProps[i].dialog] = dialog;
                Navigation.StateContext[contextProps[i].state] = dialog.states[state.key];
            }
        }
        var currentData = Navigation.StateContext.includeCurrentData({});
        Navigation.StateController.refresh(currentData);
    })
}
