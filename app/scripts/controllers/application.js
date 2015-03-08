'use strict';

/**
 * @ngdoc function
 * @name easterdashApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the easterdashApp
 */
angular.module('listeningsApp').controller('ApplicationCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
         var active = (viewLocation === $location.path());
         return active;
    };
    $scope.showModal = function(id) {
        if (!$scope.modals[id]) {
          return;
        }
        angular.forEach($scope.modals, function(modal) {
            modal.visible = false;
        });

        $scope.modals[id].visible = true;
    };

    $scope.modals = {setup:{visible: false}};
});
