import { StateNavigator } from 'navigation';
import { NavigationHandler, NavigationLink } from 'navigation-react';
import { NavigationMotion, Scene, MobileHistoryManager, SharedElement, SharedElementMotion } from 'navigation-react-mobile';
import * as React from 'react';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
], new MobileHistoryManager(url => {
    var { state, data } = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key, data).url;
}));

var People = ({ page }) => (
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

var Person = ({ id }) => (
    <SharedElement name={id} data={{ id }}>
        <div>Bob</div>
    </SharedElement>    
);

var { people, person } = stateNavigator.states;
people.renderScene = ({ page }) => <People page={page}/>;
person.renderScene = ({ id }) => <Person id={id}/>;

var ZoomShared = (props) => (
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

var App = ({crumb}) => (
    <NavigationHandler stateNavigator={stateNavigator}>
        <Scene crumb={crumb} />
    </NavigationHandler>
);
  

var Zoom = () => (
    <NavigationMotion
        app={App}
        unmountedStyle={{opacity: 1, translate: 100}}
        mountedStyle={{opacity: 1, translate: 0}}
        crumbStyle={{opacity: 0, translate: 0}}
        sharedElementMotion={props => <ZoomShared {...props} />}>
        {({ opacity, translate }) => (
            <div
                style={{
                    opacity,
                    transform: `translate(${translate}%)`,
                }} />
        )}
    </NavigationMotion>
);