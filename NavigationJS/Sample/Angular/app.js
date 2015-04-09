var app = angular.module('app', ['NavigationAngular']);

app.controller('PersonController', function ($scope) {
	$scope.id;
	$scope.name;
	$scope.people;
	$scope.personName;
	$scope.dateOfBirth;

	var personStates = Navigation.StateInfoConfig.dialogs.person.states;
	var subscription;
	personStates.list.navigated = function (data) {
		var people = personSearch.search(data.name, data.sortExpression);
		var totalRowCount = people.length;
		$scope.people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
	};
	personStates.details.navigated = function (data) {
		$scope.id = data.id;
		var person = personSearch.getDetails(data.id);
		$scope.personName = person.name;
		$scope.dateOfBirth = person.dateOfBirth;
	};
	personStates.details.dispose = function () { $scope.id = null };
	Navigation.StateController.onNavigate(function () {
		if (!$scope.$$phase)
			$scope.$apply();
	})
	Navigation.start();
});

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);
