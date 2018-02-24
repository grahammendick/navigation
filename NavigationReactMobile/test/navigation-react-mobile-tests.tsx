import { StateNavigator } from 'navigation';
import { NavigationMotion } from 'navigation-react-mobile';

const stateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
]);

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