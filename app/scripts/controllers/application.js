'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ApplicationCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
         var active = (viewLocation === $location.path());
         return active;
    };
});
