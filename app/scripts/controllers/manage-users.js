'use strict';

angular.module('listeningsApp').controller('UserCtrl', function ($scope, AuthService, Session, UserService) {
    function refreshUsers() {
        UserService.list().then(function(res) {
            $scope.users = res.data;
        });
    }

    $scope.newUser = {};
    refreshUsers();

    $scope.addNew = function(details) {
        UserService.addNew(details).then(function() {
            $scope.newUser = {};
            refreshUsers();
        });
    };
});
