import { StateNavigator } from 'navigation';
import { NavigationMotion, MobileHistoryManager } from 'navigation-react-mobile';

const stateNavigator: StateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
], new MobileHistoryManager(url => {
    var { state, data } = stateNavigator.parseLink(url);
    return stateNavigator.fluent()
        .navigate('people')
        .navigate(state.key, data).url;
}));

var People = ({ page }) => null;
var Person = ({ id }) => null;

var { people, person } = stateNavigator.states;
people.renderScene = ({ page }) => <People page={page}/>;
person.renderScene = ({ id }) => <Person id={id}/>;

var App = () => (
    <NavigationMotion
        unmountedStyle={{opacity: 1, translate: 100}}
        mountedStyle={{opacity: 1, translate: 0}}
        crumbStyle={{opacity: 0, translate: 0}}>
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
    </NavigationMotion>
);