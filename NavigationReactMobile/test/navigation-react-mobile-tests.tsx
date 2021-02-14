// tsc --jsx react --target es3 --lib ES2015,DOM --esModuleInterop --noImplicitAny true navigation-react-mobile-tests.tsx
import { StateNavigator } from 'navigation';
import { NavigationContext, NavigationLink } from 'navigation-react';
import { NavigationMotion, MobileHistoryManager, SharedElement, SharedElementMotion } from 'navigation-react-mobile';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
], new MobileHistoryManager(url => {
    const { state, data } = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key, data).url;
}));

const People = () => {
    const { data } = useContext(NavigationContext);
    const { page } = data;
    return (
        <ul>
            {['Bob', 'Brenda'].map(id => (
                <li>
                    <NavigationLink stateKey="person" navigationData={{ id }}>
                        <SharedElement name={id} data={{ id }}>
                            <div>Bob</div>
                        </SharedElement>
                    </NavigationLink>
                </li>
            ))}
        </ul>
    );
}

const Person = () => {
    const { data } = useContext(NavigationContext);
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

const Zoom = (props: any) => (
    <SharedElementMotion
        {...props}
        onAnimating={(name, ref) => {ref.style.opacity = '0'}}
        onAnimated={(name, ref) => {ref.style.opacity = '1'}}>
        {({ left, top, width, height, size }, name, { id }) => (
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