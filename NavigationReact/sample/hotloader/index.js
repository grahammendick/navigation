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
        var fluent = stateNavigator.fluent()
        var { crumbs, state, data } = stateNavigator.stateContext;
        for(var i = 0; i < crumbs.length; i++) {
            fluent = fluent.navigate(crumbs[i].state.key, crumbs[i].data)
        }
        stateNavigator.navigateLink(fluent.navigate(state.key, data).url);
    });
}
