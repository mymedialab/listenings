'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('AdminCtrl', function ($scope, $location) {
    $scope.redirect = function(path) {
        $location.path(path);
    };
});
