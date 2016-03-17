var app = angular.module('app', ['NavigationAngular']);

app.controller('PersonController', function ($scope) {
    var stateNavigator = new Navigation.StateNavigator([
        { key: 'people', route: '{startRowIndex?}/{maximumRows?}/{sortExpression?}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackTypes: false, title: 'Person Search' },
        { key: 'person', route: 'person', defaultTypes: { id: 'number' }, trackTypes: false, trackCrumbTrail: true, title: 'Person Details', }
    ]);
    $scope.stateNavigator = stateNavigator;
	$scope.id;
	$scope.name;
	$scope.people;
	$scope.sortExpression;
	$scope.personName;
	$scope.dateOfBirth;
	$scope.previous;
	$scope.next;
	$scope.last;
	$scope.totalCount;
	$scope.nameChange = function (e) {
		var data = stateNavigator.stateContext.includeCurrentData({ name: $scope.name, startRowIndex: null });
		stateNavigator.refresh(data);
	};

	var states = stateNavigator.states;
	states.people.navigated = function (data) {
		var people = personSearch.search(data.name, data.sortExpression);
		var totalRowCount = people.length;
		$scope.people = people.slice(data.startRowIndex, data.startRowIndex + data.maximumRows);
		$scope.name = data.name;
		$scope.sortExpression = data.sortExpression.indexOf('DESC') === -1 ? 'Name DESC' : 'Name';
		$scope.previous = Math.max(0, data.startRowIndex - data.maximumRows);
		$scope.next = data.startRowIndex + data.maximumRows;
		var remainder = totalRowCount % data.maximumRows;
		$scope.last = remainder != 0 ? totalRowCount - remainder : totalRowCount - data.maximumRows;
		if ($scope.next >= totalRowCount)
			$scope.next = $scope.last = data.startRowIndex;
		$scope.totalCount = totalRowCount;
	};
	states.person.navigated = function (data) {
		$scope.id = data.id;
		var person = personSearch.getDetails(data.id);
		$scope.personName = person.name;
		$scope.dateOfBirth = person.dateOfBirth;
	};
	states.person.dispose = function () { $scope.id = null };
	stateNavigator.onNavigate(function () {
		if (!$scope.$$phase)
			$scope.$apply();
	})
	stateNavigator.start();
});
