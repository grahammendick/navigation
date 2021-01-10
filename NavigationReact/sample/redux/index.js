import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import People from './People';
import Person from './Person';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import reducer from './reducer';

const stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

const {people, person} = stateNavigator.states;
people.renderScene = ({pageNumber}) => <People pageNumber={pageNumber} />
person.renderScene = ({id}) => <Person id={id} />

stateNavigator.start();

const App = () => {
    const {state, data} = useContext(NavigationContext);
    return state.renderScene(data)
};

const store = createStore(reducer);

ReactDOM.render(
    <Provider store={store}>
        <NavigationHandler stateNavigator={stateNavigator}>
            <App />
        </NavigationHandler>
    </Provider>,
  document.getElementById('content')
);
