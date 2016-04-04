var Navigation = require('navigation');
var StateController = require('./StateController');

var stateNavigator = new Navigation.StateNavigator();
StateController.configure(stateNavigator);
stateNavigator.start();

if (module.hot) {
    module.hot.accept('./StateController', function() {
        require('./StateController').configure(stateNavigator);
        stateNavigator.navigate(stateNavigator.stateContext.state.key, stateNavigator.stateContext.includeCurrentData({}));
    });
}
