/// <reference path="../src/navigation.d.ts" />

Navigation.StateInfoConfig.build([
	{ key: 'home', initial: 'page', states: [
		{ key: 'page', route: '' }
	]},
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: 'people/{page}', transitions: [
			{ key: 'select', to: 'details' }
		], defaults: { page: 1 }, trackCrumbTrail: false },
		{ key: 'details', route: 'person/{id}', defaultTypes: { id: 'number' } }
	]}
]);

Navigation.start('home');

Navigation.StateController.navigate('person');
Navigation.StateController.refresh();
Navigation.StateController.refresh({ page: 2 });
Navigation.StateController.navigate('select', { id: 10 });
if (Navigation.StateController.canNavigateBack(1)){
	Navigation.StateController.navigateBack(1);	
}

var link: string = Navigation.StateController.getNavigationLink('person');
link = Navigation.StateController.getRefreshLink();
link = Navigation.StateController.getRefreshLink({ page: 2 });
link = Navigation.StateController.getNavigationLink('select', { id: 10 });
Navigation.StateController.navigateLink(link);
link = Navigation.StateController.getNavigationBackLink(1);	


