import { StateNavigator } from 'navigation';
import { NavigationMotion } from 'navigation-react-mobile';

const stateNavigator = new StateNavigator([
    { key: 'people', route: 'people/{page}' },
    { key: 'person', route: 'person/{id}', trackCrumbTrail: true }
]);

//stateNavigator.states.people.renderScene = () => {};