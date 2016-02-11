/// <reference path="../src/navigation.d.ts" />

module NavigationTests {
	// History Manager
	class LogHistoryManager extends Navigation.HashHistoryManager  {
	    addHistory(url: string) {
			console.log('add history');
			super.addHistory(url, false);
	    }
	}
	
	// Crumb Trail Persister
	class LogCrumbTrailPersister extends Navigation.CrumbTrailPersister {
		load(crumbTrail: string): string {
			console.log('load');
			return crumbTrail;
		}
		
		save(crumbTrail: string): string {
			console.log('save');
			return crumbTrail;
		}
	}
	
	// State Router
	class LogStateRouter extends Navigation.StateRouter {
	    getData(route: string): { state: Navigation.State; data: any; separableData: any; } {
			console.log('get data');
			return super.getData(route);
	    }
	}
	
	// Settings
    var settings = {
	   router: new LogStateRouter(),
	   historyManager: new LogHistoryManager(),
	   crumbTrailPersister: new LogCrumbTrailPersister(),
	   stateIdKey: 'state'
    }
	
	// Configuration
	var config = [
		{ key: 'home', initial: 'page', help: 'home.htm', states: [
			{ key: 'page', route: '', help: 'page.htm' }
		]},
		{ key: 'person', initial: 'list', states: [
			{ key: 'list', route: ['people/{page}', 'people/{page}/sort/{sort}'], transitions: [
				{ key: 'select', to: 'details' }
			], defaults: { page: 1 }, trackCrumbTrail: false },
			{ key: 'details', route: 'person/{id}', trackTypes: false, defaultTypes: { id: 'number' } }
		]}
	];
    var stateController = new stateController(config, settings);
	
	// StateInfo
	var dialogs = stateController.dialogs;
	var home = dialogs['home'];
	var homePage = home.states['page'];
	var homeKey = home.key;
	var homePageKey = homePage.key;
	homePage = home.initial;
	var person = dialogs['person'];
	var personList = person.states['list'];
	var personDetails = person.states['details'];
	var personListSelect = personList.transitions['select'];
	personList = personListSelect.parent;
	personDetails = personListSelect.to;
	var pageDefault = personList.defaults.page;
	var idDefaultType = personDetails.defaultTypes.id;
	
	// StateNavigator
	personList.dispose = () => {};
	personList.navigating = (data, url, navigate) => {
		navigate([]);
	};
	personList.navigated = (data, asyncData) => {};
	personDetails.navigating = (data, url, navigate) => {
		navigate();
	};
	personDetails.navigated = (data) => {};
	
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
	homePage.stateHandler = new LogStateHandler();
	personList.stateHandler = new LogStateHandler();
	personDetails.stateHandler = new LogStateHandler();
	
	// Navigation Event
	var navigationListener = 
	(oldState: Navigation.State, state: Navigation.State, data: any) => {
		stateController.offNavigate(navigationListener);
	};
	stateController.onNavigate(navigationListener);
	
	// Navigation
	stateController.start('home');
	stateController.navigate('person');
	stateController.navigate('person', null, Navigation.HistoryAction.Add);
	stateController.refresh();
	stateController.refresh({ page: 3 });
	stateController.refresh({ page: 2 }, Navigation.HistoryAction.Replace);
	stateController.navigate('select', { id: 10 });
	var canGoBack: boolean = stateController.canNavigateBack(1);
	stateController.navigateBack(1);
	stateController.clearStateContext();
	
	// Navigation Link
	var link = stateController.getNavigationLink('person');
	link = stateController.getRefreshLink();
	link = stateController.getRefreshLink({ page: 2 });
	stateController.navigateLink(link);
	link = stateController.getNavigationLink('select', { id: 10 });
	var nextDialog = stateController.getNextState('select').parent;
	person = nextDialog;
	stateController.navigateLink(link, false);
	link = stateController.getNavigationBackLink(1);
	var crumb = stateController.crumbs[0];
	link = crumb.navigationLink;
	stateController.navigateLink(link, true, Navigation.HistoryAction.None);
	
	// StateContext
	stateController.navigate('home');
	stateController.navigate('person');
	home = stateController.stateContext.previousDialog;
	homePage = stateController.stateContext.previousState;
	person === stateController.stateContext.dialog;
	personList === stateController.stateContext.state;
	var url: string = stateController.stateContext.url;
	var title: string = stateController.stateContext.title;
	var page: number = stateController.stateContext.data.page;
	stateController.refresh({ page: 2 });
	person = stateController.stateContext.oldDialog;
	personList = stateController.stateContext.oldState;
	page = stateController.stateContext.oldData.page;
	page = stateController.stateContext.previousData.page;
	
	// Navigation Data
	var data = stateController.stateContext.includeCurrentData({ sort: 'name' }, ['page']);
	stateController.refresh(data);
	stateController.stateContext.clear('sort');
	var data = stateController.stateContext.includeCurrentData({ pageSize: 10 });
	stateController.refresh(data);
	stateController.stateContext.clear();
	stateController.refresh();
}