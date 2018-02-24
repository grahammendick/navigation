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
    <NavigationMotion>
        {(style, scene, key) => (
            <div key={key}>
                {scene}
            </div>
        )}
    </NavigationMotion>
);