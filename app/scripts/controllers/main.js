'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('MainCtrl', function ($scope, AuthService) {
    $scope.login = AuthService.login;
});
