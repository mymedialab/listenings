'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ApplicationCtrl', function ($scope, $location, Session, AuthService) {
    $scope.user = false;
    $scope.loading = true;
    $scope.isActive = function (viewLocation) {
         var active = (viewLocation === $location.path());
         return active;
    };
    $scope.$watch(function() { return Session.user; }, function(newUser) {
        $scope.user = newUser;
    });
    $scope.logout = function() {
        AuthService.logout();
    };
    $scope.isAdmin = function() {
        return (AuthService.isAuthenticated && Session.user && Session.user.is_admin); // jshint ignore:line
    };
    AuthService.findOpenSession().then(function() {
        $scope.loading = false;
    });

    AuthService.findOpenSession();
});
