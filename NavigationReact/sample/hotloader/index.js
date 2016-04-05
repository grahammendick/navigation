var Navigation = require('navigation');
var Router = require('./Router');

var stateNavigator = new Navigation.StateNavigator();
Router.configure(stateNavigator);
stateNavigator.start();

if (module.hot) {
    module.hot.accept('./Router', function() {
        require('./Router').configure(stateNavigator);
        stateNavigator.navigate(stateNavigator.stateContext.state.key, stateNavigator.stateContext.includeCurrentData({}));
    });
}
