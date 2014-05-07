function PersonController($scope, $http) {
    $scope.name;
    $scope.minDateOfBirth;
    $scope.people;
    $scope.search = function () {
        var url = '/WebApiList';
        if ($scope.name)
            url += '?name=' + $scope.name;
        $http.get(url)
            .success(function (data) {
                $scope.people = data;
            }
        );
    }
    $scope.search();
};