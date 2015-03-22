'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:CreateListeningCtrl
 * @description
 * # CreateListeningCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('CreateListeningCtrl', function ($scope, questionSets, ngToast) {
    $scope.listening = {
        name: '',
        questions: [],
        taggable: []
    };
    $scope.saveListening = function(listening) {
        questionSets.create(listening).then(function() {
            ngToast.create({content: 'New type created', className: 'success'});
            $scope.listening = {
                name: '',
                questions: [],
                taggable: []
            };
        }).catch(function() {
            ngToast.create({content: 'Creation failed', className: 'danger'});
        });
    };
});
