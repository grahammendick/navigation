import { StateNavigator } from 'navigation';

const stateNavigator = new StateNavigator([
  {key: 'people', route: '{pageNumber?}', defaults: {pageNumber: 1}},
  {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
]);

export default stateNavigator;
