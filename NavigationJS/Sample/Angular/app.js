var app = angular.module('app', ['NavigationAngular']);

app.controller('PersonController', function ($scope) {
	$scope.id;
	$scope.name;
	$scope.people;
	$scope.sortExpression;
	$scope.personName;
	$scope.dateOfBirth;
	$scope.previous;
	$scope.previousVisible;
	$scope.next;
	$scope.nextVisible;
	$scope.last;
	$scope.totalCount;

	var personStates = Navigation.StateInfoConfig.dialogs.person.states;
	var subscription;
	personStates.list.navigated = function (data) {
		var people = personSearch.search(data.name, data.sortExpression);
		var totalRowCount = people.length;
		$scope.people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
		$scope.sortExpression = data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
		$scope.previous = data.startRowIndex - data.maximumRows;
		$scope.previousVisible = $scope.previous >= 0;
		$scope.next = data.startRowIndex + data.maximumRows;
		$scope.nextVisible = $scope.next < totalRowCount;
		var remainder = totalRowCount % data.maximumRows;
		$scope.last = remainder != 0 ? totalRowCount - remainder : totalRowCount - data.maximumRows;
		$scope.totalCount = totalRowCount;
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
