'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:CreateListeningCtrl
 * @description
 * # CreateListeningCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('CreateQuestionnaireCtrl', function ($scope, questionSets, ngToast) {
    $scope.listening = {
        name: '',
        questions: [],
        taggable: []
    };

    $scope.addTo = function(key, question) {
        if ($scope.listening[key].indexOf(question) !== -1) {
            ngToast.create({
              content:   'Cannot save duplicate!',
              className: 'warning'
            });
            return false;
          }
          $scope.listening[key].push(question);
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
