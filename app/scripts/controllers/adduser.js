'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('AddUserCtrl', function ($scope, AuthService, Session, UserService) {
    $scope.newUser = {};

    $scope.addNew = function(details) {
        UserService.addNew(details).then(function() {
            $scope.newUser = {};
        });
    };
});
