var app = angular.module('app', ['NavigationAngular']);

app.controller('PersonController', function ($scope) {
	$scope.id;
	$scope.name;
	$scope.people;

	var personStates = Navigation.StateInfoConfig.dialogs.person.states;
	var subscription;
	personStates.list.navigated = function (data) {
		$scope.people = personSearch.search(data.name, data.sortExpression);
	};
	Navigation.start();
});

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);
