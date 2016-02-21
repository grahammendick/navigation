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
    var stateController = new Navigation.StateController(config, new LogHistoryManager());
	
	// States
	var states = stateController.states;
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
		stateController.offNavigate(navigationListener);
	};
	stateController.onNavigate(navigationListener);
	
	// Navigation
	stateController.start('home');
	stateController.navigate('person');
	stateController.navigate('person', null, 'add');
	stateController.refresh();
	stateController.refresh({ page: 3 });
	stateController.refresh({ page: 2 }, 'replace');
	stateController.navigate('select', { id: 10 });
	var canGoBack: boolean = stateController.canNavigateBack(1);
	stateController.navigateBack(1);
	stateController.stateContext.clear();
	
	// Navigation Link
	var link = stateController.getNavigationLink('person');
	link = stateController.getRefreshLink();
	link = stateController.getRefreshLink({ page: 2 });
	stateController.navigateLink(link);
	link = stateController.getNavigationLink('select', { id: 10 });
	stateController.navigateLink(link, 'replace');
	link = stateController.getNavigationBackLink(1);
	var crumb = stateController.stateContext.crumbs[0];
	link = crumb.navigationLink;
	stateController.navigateLink(link, 'none', true);
	
	// StateContext
	stateController.navigate('home');
	stateController.navigate('person');
	home = stateController.stateContext.previousState;
	people === stateController.stateContext.state;
	var url: string = stateController.stateContext.url;
	var title: string = stateController.stateContext.title;
	var page: number = stateController.stateContext.data.page;
	stateController.refresh({ page: 2 });
	person = stateController.stateContext.oldState;
	page = stateController.stateContext.oldData.page;
	page = stateController.stateContext.previousData.page;
	
	// Navigation Data
	var data = stateController.stateContext.includeCurrentData({ sort: 'name' }, ['page']);
	stateController.refresh(data);
	var data = stateController.stateContext.includeCurrentData({ pageSize: 10 });
	stateController.refresh(data);
}