// tsc --jsx react --target es3 --lib ES2015,DOM --noImplicitAny true navigation-react-tests.tsx
import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationContext, NavigationBackLink, NavigationLink, RefreshLink } from 'navigation-react';
import * as React from 'react';

const stateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page?}', defaults: { page: 0 } },
    { key: 'person', route: 'person/{name}', trackCrumbTrail: true }
]);

var People = ({ page }: any) => (
    <div>
        <ul>
            {['Bob', 'Brenda'].map(name => (
                <li>
                    <NavigationLink
                        stateKey="person"
                        navigationData={{ name }}>
                        {name}
                    </NavigationLink>
                </li>
            ))}
        </ul>
        <RefreshLink
            navigationData={{ page: page++ }}
            disableActive={true}
            includeCurrentData={true}>
            Next
        </RefreshLink>
    </div>
);

var Person = ({ name }: any) => (
    <div>
        <NavigationBackLink distance={1}>List</NavigationBackLink>
        <div>{name}</div>
    </div>
);

var { people, person } = stateNavigator.states;
people.renderView = ({ page }: any) => <People page={page} />; 
person.renderView = ({ name }: any) => <Person name={name} />;

var App = () => (
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({ state, data }) => state.renderView(data)}
        </NavigationContext.Consumer>
    </NavigationHandler>
);
