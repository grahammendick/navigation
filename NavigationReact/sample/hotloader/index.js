import React, {useContext} from 'react';
import ReactDOM from 'react-dom';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { StateNavigator } from 'navigation';
import { configure } from './Router';

var stateNavigator = new StateNavigator();
configure(stateNavigator);

stateNavigator.start();

const App = () => {
    const {state, data} = useContext(NavigationContext);
    return state.renderScene(data)
};

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <App />
    </NavigationHandler>,
    document.getElementById('content')
);

if (module.hot) {
    module.hot.accept('./Router', function() {
        require('./Router').configure(stateNavigator);
        var fluent = stateNavigator.fluent()
        var { crumbs, state, data } = stateNavigator.stateContext;
        for(var i = 0; i < crumbs.length; i++) {
            fluent = fluent.navigate(crumbs[i].state.key, crumbs[i].data)
        }
        stateNavigator.navigateLink(fluent.navigate(state.key, data).url);
    });
}
