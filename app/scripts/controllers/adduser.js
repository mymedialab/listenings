'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('AddUserCtrl', function ($scope, AuthService, Session, UserService) {
    $scope.isAdmin = false;
    AuthService.findOpenSession().then(function() {
        if (AuthService.isAuthenticated && Session.user.is_admin) { /* jshint ignore:line */
            $scope.isAdmin = true; /* jshint ignore:line */
        }
    });

    $scope.addNew = function(details) {
        UserService.addNew(details).then(function() {
            $scope.newUser = {};
        });
    };
});
