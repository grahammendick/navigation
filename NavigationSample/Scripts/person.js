function PersonController($scope, $http) {
    $scope.people;
    $scope.search = function () {
        $http.get('/WebApiList')
            .success(function (data) {
                $scope.people = data;
            }
        );
    }
    $scope.search();
};