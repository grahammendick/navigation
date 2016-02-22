/// <reference path="../src/navigation.d.ts" />

module NavigationTests {
	// History Manager
	class LogHistoryManager extends Navigation.HashHistoryManager  {
	    addHistory(url: string) {
			console.log('add history');
			super.addHistory(url, false);
	    }
	}
	
	// Configuration
	var config = [
        { key: 'home', route: '', help: 'home.htm' },
        { key: 'people', route: ['people/{page}', 'people/{page}/sort/{sort}'], defaults: { page: 1 } },
        { key: 'person', route: 'person/{id}', trackTypes: false, defaultTypes: { id: 'number' }, trackCrumbTrail: true }
	];
    var stateNavigator = new Navigation.StateNavigator(config, new LogHistoryManager());
	
	// States
	var states = stateNavigator.states;
	var home = states['home'];
	var homeKey = home.key;
	var people = states['people'];
	var person = states['person'];
	var pageDefault = people.defaults.page;
	var idDefaultType = person.defaultTypes.id;
	
	// StateNavigator
	people.dispose = () => {};
	people.navigating = (data, url, navigate) => {
		navigate([]);
	};
	people.navigated = (data, asyncData) => {};
	person.navigating = (data, url, navigate) => {
		navigate();
	};
	person.navigated = (data) => {};
	
	// State Handler
	class LogStateHandler extends Navigation.StateHandler {
		getNavigationLink(router: Navigation.IRouter, state: Navigation.State): string {
			console.log('get navigation link');
			return super.getNavigationLink(router, state, data, { ids: [] });
		}
	    getNavigationData(router: Navigation.IRouter, state: Navigation.State, url: string): { data: any; separableData: any; } {
			console.log('get navigation data');
			return super.getNavigationData(router, state, url);
	    }
        urlEncode(state: Navigation.State, key: string, val: string, queryString: boolean): string {
            return queryString ? val.replace(/\s/g, '+') : super.urlEncode(state, key, val, queryString);
        }
        urlDecode(state: Navigation.State, key: string, val: string, queryString: boolean): string {
            return queryString ? val.replace(/\+/g, ' ') : super.urlDecode(state, key, val, queryString);
        }
	}
	home.stateHandler = new LogStateHandler();
	people.stateHandler = new LogStateHandler();
	person.stateHandler = new LogStateHandler();
	
	// Navigation Event
	var navigationListener = 
	(oldState: Navigation.State, state: Navigation.State, data: any) => {
		stateNavigator.offNavigate(navigationListener);
	};
	stateNavigator.onNavigate(navigationListener);
	
	// Navigation
	stateNavigator.start('home');
	stateNavigator.navigate('person');
	stateNavigator.navigate('person', null, 'add');
	stateNavigator.refresh();
	stateNavigator.refresh({ page: 3 });
	stateNavigator.refresh({ page: 2 }, 'replace');
	stateNavigator.navigate('select', { id: 10 });
	var canGoBack: boolean = stateNavigator.canNavigateBack(1);
	stateNavigator.navigateBack(1);
	stateNavigator.stateContext.clear();
	
	// Navigation Link
	var link = stateNavigator.getNavigationLink('person');
	link = stateNavigator.getRefreshLink();
	link = stateNavigator.getRefreshLink({ page: 2 });
	stateNavigator.navigateLink(link);
	link = stateNavigator.getNavigationLink('select', { id: 10 });
	stateNavigator.navigateLink(link, 'replace');
	link = stateNavigator.getNavigationBackLink(1);
	var crumb = stateNavigator.stateContext.crumbs[0];
	link = crumb.navigationLink;
	stateNavigator.navigateLink(link, 'none', true);
	
	// StateContext
	stateNavigator.navigate('home');
	stateNavigator.navigate('person');
	home = stateNavigator.stateContext.previousState;
	people === stateNavigator.stateContext.state;
	var url: string = stateNavigator.stateContext.url;
	var title: string = stateNavigator.stateContext.title;
	var page: number = stateNavigator.stateContext.data.page;
	stateNavigator.refresh({ page: 2 });
	person = stateNavigator.stateContext.oldState;
	page = stateNavigator.stateContext.oldData.page;
	page = stateNavigator.stateContext.previousData.page;
	
	// Navigation Data
	var data = stateNavigator.stateContext.includeCurrentData({ sort: 'name' }, ['page']);
	stateNavigator.refresh(data);
	var data = stateNavigator.stateContext.includeCurrentData({ pageSize: 10 });
	stateNavigator.refresh(data);
}