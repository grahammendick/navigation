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
Navigation.StateController.refresh({ page: 2 });
Navigation.StateController.navigate('select', { id: 10 });
Navigation.StateController.navigateBack(1);

