import { StateNavigator } from 'navigation';

const stateNavigator = new StateNavigator([
  {key: 'people', route: '{page?}', defaults: { page: 1, sort: 'asc'}},
  {key: 'person', route: 'person/{id}', defaults: {id: 0}, trackCrumbTrail: true}
]);

export default stateNavigator;
