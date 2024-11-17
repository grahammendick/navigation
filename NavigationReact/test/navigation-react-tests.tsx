// npx tsc --jsx react --target es5 --lib ES2015,DOM --esModuleInterop --baseUrl ../../types --noImplicitAny true --strict true navigation-react-tests.tsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext, NavigationEvent, SceneView, NavigationBackLink, NavigationLink, RefreshLink } from 'navigation-react';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

type AppNavigation = {
    people: { page?: number },
    person: { name: string }
}

const stateNavigator = new StateNavigator<AppNavigation>([
    { key: 'people', route: 'people/{page?}', defaults: { page: 0 } },
    { key: 'person', route: 'person/{name}', trackCrumbTrail: true }
]);

const People = () => {
    const { data } = useContext<NavigationEvent<AppNavigation, 'people'>>(NavigationContext);
    const { page } = data;
    return (
        <div>
            <ul>
                {['Bob', 'Brenda'].map(name => (
                    <li>
                        <NavigationLink<AppNavigation, 'person'>
                            stateKey="person"
                            navigationData={{ name }}>
                            {name}
                        </NavigationLink>
                    </li>
                ))}
            </ul>
            <RefreshLink<AppNavigation, 'people'>
                navigationData={{ page: page! + 1 }}
                disableActive={true}
                includeCurrentData={true}>
                Next
            </RefreshLink>
        </div>
    );
}

const Person = () => {
    const { data } = useContext<NavigationEvent<AppNavigation, 'person'>>(NavigationContext);
    const { name } = data;
    return (
        <div>
            <NavigationBackLink distance={1}>List</NavigationBackLink>
            <div>{name}</div>
        </div>
    );
}

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <SceneView active="people"><People /></SceneView>
        <SceneView active="person"><Person /></SceneView>
    </NavigationHandler>,
    document.getElementById('root')
);