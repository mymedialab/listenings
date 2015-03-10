'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('AdminCtrl', function ($scope, AuthService, Session) {
    $scope.isAdmin = false;
    AuthService.findOpenSession().then(function() {
        if (AuthService.isAuthenticated && Session.user.is_admin) { /* jshint ignore:line */
            $scope.isAdmin = true; /* jshint ignore:line */
        }
    });
});
