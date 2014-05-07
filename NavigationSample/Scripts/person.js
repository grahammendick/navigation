function PersonController($scope, $http) {
    $scope.name;
    $scope.minDateOfBirth;
    $scope.sortExpression = 'Name';
    $scope.startRowIndex = 0;
    $scope.maximumRows = 10;
    $scope.totalRowCount;
    $scope.people;
    $scope.getList = function () {
        var url = '/WebApiList/' + $scope.startRowIndex + '/'
            + $scope.maximumRows + '/' + encodeURI($scope.sortExpression);
        if ($scope.name)
            url += '?name=' + $scope.name;
        $http.get(url)
            .success(function (data) {
                $scope.people = data.People;
                $scope.totalRowCount = data.TotalRowCount;
            }
        );
    }
    $scope.search = function () {
        $scope.startRowIndex = 0;
        $scope.sortExpression = 'Name';
        $scope.getList();
    }
    $scope.sort = function () {
        $scope.sortExpression = $scope.sortExpression == 'Name' ? 'Name DESC' : 'Name';
        $scope.getList();
    }
    $scope.changePageSize = function (size) {
        $scope.startRowIndex = 0;
        $scope.maximumRows = size;
        $scope.getList();
    }
    $scope.firstPage = function () {
        $scope.startRowIndex = 0;
        $scope.getList();
    }
    $scope.previousPage = function () {
        $scope.startRowIndex = $scope.startRowIndex - $scope.maximumRows;
        $scope.getList();
    }
    $scope.nextPage = function () {
        $scope.startRowIndex = $scope.startRowIndex + $scope.maximumRows;
        $scope.getList();
    }
    $scope.lastPage = function () {
        var remainder = $scope.totalRowCount % $scope.maximumRows;
        $scope.startRowIndex = remainder != 0 ? $scope.totalRowCount - remainder : $scope.totalRowCount - $scope.maximumRows;
        $scope.getList();
    }
    $scope.showFirstPrev = function () {
        return $scope.startRowIndex > 0;
    }
    $scope.showNextLast = function () {
        return $scope.totalRowCount > $scope.startRowIndex + $scope.maximumRows;
    }
    $scope.getList();
};
