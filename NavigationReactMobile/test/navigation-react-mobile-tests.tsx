// npx tsc --jsx react --target es5 --lib ES2015,DOM --esModuleInterop --baseUrl ../../types --noImplicitAny true --strict true navigation-react-mobile-tests.tsx
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationEvent, NavigationLink } from 'navigation-react';
import { Scene, MobileHistoryManager, SharedElement, NavigationStack } from 'navigation-react-mobile';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

type AppNavigation = {
    people: { page?: number },
    person: { id: string }
}

const stateNavigator: StateNavigator<AppNavigation> = new StateNavigator<AppNavigation>([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
], new MobileHistoryManager(url => {
    const { state, data } = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key as any, data).url;
}));

const People = () => (
    <ul>
        {['Bob', 'Brenda'].map(id => (
            <li>
                <NavigationLink<AppNavigation, 'person'> stateKey="person" navigationData={{ id }}>
                    <SharedElement name={id} data={{ id }}>
                        <div>Bob</div>
                    </SharedElement>
                </NavigationLink>
            </li>
        ))}
    </ul>
);

const Person = () => {
    const { data } = useContext<NavigationEvent<AppNavigation, 'person'>>(NavigationContext);
    const { id } = data;
    return (
        <SharedElement name={id} data={{ id }}>
            <div>Bob</div>
        </SharedElement>    
    );
}

stateNavigator.start();

ReactDOM.render(
    <NavigationStack
        unmountStyle={[
            {transform: 'translateX(100%)'},
            {transform: 'translateX(0)'}
          ]}
        crumbStyle={[
            {transform: 'translateX(5%) scale(0.8)', opacity: 0},
            {transform: 'translateX(0) scale(1)', opacity: 1}
          ]}>
        <Scene stateKey="people" sharedElements={({id}) => [id]}><People /></Scene>
        <Scene stateKey="person"><Person /></Scene>
    </NavigationStack>,
    document.getElementById('root')
);