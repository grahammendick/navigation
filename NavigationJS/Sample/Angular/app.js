function PersonController($scope) {
	$scope.action = 'select';
	$scope.id = 1;
	$scope.something = 2;
	$scope.changeAction = function () {
		$scope.action = $scope.action === 'a' ? 'select' : 'a';
	}
	$scope.changeId = function () {
		$scope.id = $scope.id + 1;
	}
	$scope.changeSomething = function () {
		$scope.something = $scope.something  + 1;
	}
}
angular.module('app', ['NavigationAngular'])
	.controller('PersonController', PersonController);

Navigation.StateInfoConfig.build([
	{ key: 'person', initial: 'list', states: [
		{ key: 'list', route: '{startRowIndex}/{maximumRows}/{sortExpression}', defaults: { startRowIndex: 0, maximumRows: 10, sortExpression: 'Name'}, trackCrumbTrail: false, title: 'Person Search', transitions: [
			{ key: 'select', to: 'details' }]},
		{ key: 'details', route: 'person', title: 'Person Details', }]}
]);
Navigation.start();