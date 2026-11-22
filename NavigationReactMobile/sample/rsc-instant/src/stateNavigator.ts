import { StateNavigator } from 'navigation';
import { MobileHistoryManager } from 'navigation-react-mobile';

const createStateNavigator = () => new StateNavigator([
  {key: 'people', route: '{page?}', defaults: {page: 1, sort: 'asc', size: 10}},
  {key: 'person', route: 'person/{id}+/{show}', defaults: {id: 0, show: false}, trackCrumbTrail: true}
], new MobileHistoryManager(null, ''));

export default createStateNavigator;
