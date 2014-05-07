var app = angular.module('app', []);

app.service('PersonService', function ($http, $rootScope) {
    this.search = function ($scope) {
        $http.get('/WebApiList')
            .success(function (data) {
                $rootScope.people = data;
            }
        );
    }
})

app.controller('PersonController', function ($scope, PersonService) {
    $scope.people;
    PersonService.search();
});