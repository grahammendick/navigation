import { Listing, Details } from './Component';
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

stateNavigator.states.people.renderView = ({pageNumber}) => <Listing pageNumber={pageNumber} />
stateNavigator.states.person.renderView = data => <Details person={person} />

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

/**
 * Finds the person from the people in the store and id in the navigation data.
 * Renders the Details Component with the person.
 */
stateNavigator.states.person.render = function(data, store) {
    var people = store.getState();
    var person = people.filter((person) => person.id === data.id)[0];
    var handleChange = (name) => {
        store.dispatch({
            type: 'EDIT',
            id: person.id,
            name: name
        });
    };
    ReactDOM.render(
        <Details
            person={person}
            handleChange={handleChange}
            stateNavigator={stateNavigator} />,
        document.getElementById('content')
    );
};
