// npx tsc --target es5 --lib ES2015,DOM --noImplicitAny true --strict true navigation-tests.ts
import { HashHistoryManager, StateNavigator, State } from 'navigation';

// History Manager
class LogHistoryManager extends HashHistoryManager  {
    addHistory(url: string) {
        console.log('add history');
        super.addHistory(url, false);
    }
}

type AppNavigation = {
    people: { page?: number, sort?: string, pageSize?: number },
    person: { id: number }
}

// Configuration
const stateNavigator = new StateNavigator<AppNavigation>([
    { key: 'people', route: ['people/{page}', 'people/{page}/sort/{sort}'], defaults: { page: 1 }, help: 'people.htm' },
    { key: 'person', route: 'person/{id}', trackTypes: false, defaultTypes: { id: 'number' }, trackCrumbTrail: true }
], new LogHistoryManager());

// States
const { people, person } = stateNavigator.states;
const help = people['help'];
const pageDefault = people.defaults.page;
const idDefaultType = person.defaultTypes.id;

// State Controller
people.dispose = () => {};
people.navigating = (data, url, navigate) => {
    navigate([]);
};
people.navigated = (data, asyncData) => {};
person.navigating = (data, url, navigate) => {
    navigate();
};
person.navigated = (data) => {};
person.urlEncode = function urlEncode(state, key, val, queryString): string {
    return queryString ? val.replace(/\s/g, '+') : encodeURIComponent(val);
};
person.urlDecode = function urlDecode(state, key, val, queryString): string {
    return queryString ? val.replace(/\+/g, ' ') : decodeURIComponent(val);
};
person.validate = (data) => data.id > 0;
person.truncateCrumbTrail = (state, data, crumbs) => crumbs;

// Navigation Event
const navigationListener = (oldState: State, state: State, data: any, asyncData: any) => {
    stateNavigator.offNavigate(navigationListener);
};
stateNavigator.onNavigate(navigationListener);

// Navigation
stateNavigator.navigate('people');
stateNavigator.navigate('people', null, 'add');
stateNavigator.refresh();
stateNavigator.refresh({ page: 3 });
stateNavigator.refresh({ page: 2 }, 'replace');
stateNavigator.navigate('person', { id: 10 });
const canGoBack: boolean = stateNavigator.canNavigateBack(1);
stateNavigator.navigateBack(1);
stateNavigator.stateContext.clear();

// Navigation Link
let link = stateNavigator.getNavigationLink('people');
link = stateNavigator.getRefreshLink();
link = stateNavigator.getRefreshLink({ page: 2 });
stateNavigator.navigateLink(link);
link = stateNavigator.getNavigationLink('person', { id: 10 });
stateNavigator.navigateLink(link, 'replace');
link = stateNavigator.getNavigationBackLink(1);
const crumb = stateNavigator.stateContext.crumbs[0];
link = crumb.url;
stateNavigator.navigateLink(link, 'none', true);

// Fluent Navigation
link = stateNavigator.fluent()
    .navigate('people')
    .refresh()
    .refresh({ page: 3 })
    .navigate('person', { id: 10 })
    .navigateBack(1)
    .url;

// State Context
let state: State = stateNavigator.stateContext.state;
let url: string = stateNavigator.stateContext.url;
const title: string = stateNavigator.stateContext.title;
let page: number = stateNavigator.stateContext.data.page;
const peopleList = stateNavigator.stateContext.asyncData;
const history: boolean = stateNavigator.stateContext.history;
state = stateNavigator.stateContext.oldState;
url = stateNavigator.stateContext.oldUrl;
page = stateNavigator.stateContext.oldData.page;
state = stateNavigator.stateContext.previousState;
url = stateNavigator.stateContext.previousUrl;
page = stateNavigator.stateContext.previousData.page;

// Navigation Data
let data = stateNavigator.stateContext.includeCurrentData({ sort: 'name' }, ['page']);
stateNavigator.refresh(data);
data = stateNavigator.stateContext.includeCurrentData({ pageSize: 10 });
stateNavigator.refresh(data);
