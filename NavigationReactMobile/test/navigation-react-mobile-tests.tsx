// tsc --jsx react --target es3 --lib ES2015,DOM --esModuleInterop --noImplicitAny true --strict true navigation-react-mobile-tests.tsx
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationEvent, NavigationLink } from 'navigation-react';
import { NavigationMotion, MobileHistoryManager, SharedElement, SharedElementMotion } from 'navigation-react-mobile';
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

const { people, person } = stateNavigator.states;
people.renderScene = () => <People />;
person.renderScene = () => <Person />;

stateNavigator.start();

const Zoom = (props: any) => (
    <SharedElementMotion
        {...props}
        onAnimating={(_, ref) => {ref.style.opacity = '0'}}
        onAnimated={(_, ref) => {ref.style.opacity = '1'}}>
        {({ left, top, width, height }, name, { id }) => (
            <div
                key={name}
                style={{
                    position: 'absolute',
                    left, top, width, height,
                }}>
                {id}
            </div>
        )}
    </SharedElementMotion>
);

ReactDOM.render(
    <NavigationMotion
        unmountedStyle={{opacity: 1, translate: 100}}
        mountedStyle={{opacity: 1, translate: 0}}
        crumbStyle={{opacity: 0, translate: 0}}
        sharedElementMotion={props => <Zoom {...props} />}>
        {({ opacity, translate }, scene, key) => (
            <div
                key={key}
                style={{
                    opacity,
                    transform: `translate(${translate}%)`,
                }}>
                {scene}
            </div>
        )}
    </NavigationMotion>,
    document.getElementById('root')
);