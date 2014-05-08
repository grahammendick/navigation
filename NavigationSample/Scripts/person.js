function PersonController($scope, $http) {
    $scope.currentName;
    $scope.currentMinDateOfBirth;
    $scope.name;
    $scope.minDateOfBirth;
    $scope.sortExpression = 'Name';
    $scope.startRowIndex = 0;
    $scope.maximumRows = 10;
    $scope.totalRowCount;
    $scope.people;
    $scope.dateError = false;
    $scope.getList = function () {
        var url = '/WebApiList/' + $scope.startRowIndex + '/'
            + $scope.maximumRows + '/' + encodeURI($scope.sortExpression);
        var prefix = '?';
        if ($scope.currentName) {
            url += prefix + 'name=' + encodeURI($scope.currentName);
            prefix = '&'
        }
        if ($scope.currentMinDateOfBirth)
            url += prefix + 'minDateOfBirth=' + encodeURI($scope.currentMinDateOfBirth);
        $http.get(url)
            .success(function (data) {
                $scope.dateError = false;
                if (!data.DateError) {
                    $scope.people = data.People;
                    $scope.totalRowCount = data.TotalRowCount;
                    $scope.name = $scope.currentName;
                    $scope.minDateOfBirth = $scope.currentMinDateOfBirth;
                } else {
                    $scope.dateError = true;
                }

            }
        );
    }
    $scope.search = function () {
        $scope.currentName = $scope.name;
        $scope.currentMinDateOfBirth = $scope.minDateOfBirth;
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
    $scope.select = function (person) {
        $http.get(person.link)
            .success(function (data) {
            }
        );
    }
    $scope.getList();
};
