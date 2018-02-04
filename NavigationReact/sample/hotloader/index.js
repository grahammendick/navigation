import React from 'react';
import ReactDOM from 'react-dom';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import { StateNavigator } from 'navigation';
import { configure } from './Router';

var stateNavigator = new StateNavigator();
configure(stateNavigator);
stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, data }) => state.renderView(data)}
        </NavigationContext.Consumer>        
    </NavigationHandler>,
    document.getElementById('content')
);

if (module.hot) {
    module.hot.accept('./Router', function() {
        require('./Router').configure(stateNavigator);
        stateNavigator.navigate(stateNavigator.stateContext.state.key, stateNavigator.stateContext.includeCurrentData({}));
    });
}
