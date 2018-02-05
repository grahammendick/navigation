import People from './People';
import Person from './Person';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducer';

var stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

stateNavigator.states.people.renderView = ({pageNumber}) => <People pageNumber={pageNumber} />
stateNavigator.states.person.renderView = ({id}) => <Person id={id} />

stateNavigator.start();

var store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <NavigationHandler stateNavigator={stateNavigator}>
            <NavigationContext.Consumer>
                {({ state, data }) => state.renderView(data)}
            </NavigationContext.Consumer>        
        </NavigationHandler>
    </Provider>,
    document.getElementById('content')
);
