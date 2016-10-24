import Navigation from 'navigation';
import { configure } from './Router';

var stateNavigator = new Navigation.StateNavigator();
configure(stateNavigator);
stateNavigator.start();

if (module.hot) {
    module.hot.accept('./Router', function() {
        require('./Router').configure(stateNavigator);
        stateNavigator.navigate(stateNavigator.stateContext.state.key, stateNavigator.stateContext.includeCurrentData({}));
    });
}
