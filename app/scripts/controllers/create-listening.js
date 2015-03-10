'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:CreateListeningCtrl
 * @description
 * # CreateListeningCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('CreateListeningCtrl', function ($scope) {
    $scope.listening = {
        name: '',
        questions: [],
        taggables: []
    };
    $scope.saveListening = function(listening) {

    };
});
