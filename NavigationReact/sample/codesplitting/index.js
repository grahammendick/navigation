import { searchPeople, getPerson } from './Data';
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationHandler } from 'navigation-react';
import React, { Suspense, lazy, useContext } from 'react';
import ReactDOM from 'react-dom';
const People = lazy(() => import('./People'));
const Person = lazy(() => import('./Person'));

const stateNavigator = new StateNavigator([
    {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1 }},
    {key: 'person', route: 'person/{id}', defaults: {id: 0 }, trackCrumbTrail: true}
]);

const {people, person} = stateNavigator.states;
people.renderScene = ({pageNumber}) => <People people={searchPeople(pageNumber)} />;
person.renderScene = ({id}) => <Person person={getPerson(id)} />;

stateNavigator.start();

const App = () => {
    const {state, data} = useContext(NavigationContext);
    return state.renderScene(data)
};

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <Suspense fallback={<div>Loading...</div>}>
            <App />
        </Suspense>
    </NavigationHandler>,
    document.getElementById('content')
);