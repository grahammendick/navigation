function PersonController($scope, $http) {
    $scope.name;
    $scope.minDateOfBirth;
    $scope.sortExpression = 'Name';
    $scope.startRowIndex = 0;
    $scope.maximumRows = 10;
    $scope.people;
    $scope.search = function () {
        var url = '/WebApiList/' + $scope.startRowIndex + '/'
            + $scope.maximumRows + '/' + encodeURI($scope.sortExpression);
        if ($scope.name)
            url += '?name=' + $scope.name;
        $http.get(url)
            .success(function (data) {
                $scope.people = data;
            }
        );
    }
    $scope.sort = function () {
        $scope.sortExpression = $scope.sortExpression == 'Name' ? 'Name DESC' : 'Name';
        $scope.search();
    }
    $scope.search();
};
