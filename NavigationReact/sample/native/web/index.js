import ComponentA from './ComponentA.js';
import { StateNavigator } from 'navigation';

var stateNavigator = new StateNavigator([
    { key: 'first', renderScene: () => <ComponentA title="First" /> },
    { key: 'second', trackCrumbTrail: true, renderScene: () => <ComponentA title="Second" /> }
]);

stateNavigator.start('first');
