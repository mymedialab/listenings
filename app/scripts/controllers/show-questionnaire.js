'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ListListeningsCtrl
 * @description
 * # ListListeningsCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ShowQuestionnaireCtrl', function($scope, $http, $routeParams, $location, questionSets, ngToast) {
    $scope.loading = true;

    questionSets.getQuestions($routeParams.questionnaire_id).then(function(doc) {
        $scope.questionnaire = doc;
        $scope.loading       = false;

        $scope.saveQuestion = function(question) {
          if ($scope.questionnaire.questions.indexOf(question) !== -1) {
            ngToast.create({
              content:   'Cannot save duplicate question!',
              className: 'warning'
            });
            return false;
          }

          $scope.questionnaire.questions.push(question);
          $scope.newQuestion.question = '';
        };

        $scope.saveTaggable = function(taggable) {
          if ($scope.questionnaire.taggable.filter(function(existing) { return existing.name === taggable.name; }).length > 0) {
            ngToast.create({
              content:   'Cannot save duplicate taggable!',
              className: 'warning'
            });
            return false;
          }

          $scope.questionnaire.taggable.push(taggable);
          $scope.newTaggable.taggable = {};
        };

        $scope.saveQuestionnaire = function() {
          $http.put('/api/questionnaires/' + $scope.questionnaire.id, $scope.questionnaire).success(function() {
            ngToast.create({
              message: 'Successfully updated ' + $scope.questionnaire.name,
              className: 'info'
            });
          }).error(function() {
            ngToast.create({
              message: 'Failed to upload changes, please try again shortly',
              className: 'danger'
            });
          }).then(function() {
            return questionSets.forceSync();
          }).catch(function() {
              ngToast.create({
                message: 'failed to sync changes to questionnaires, new questions may not appear momentarily.',
                className: 'danger'
              });
          }).then(function() {
              $location.path('/questionnaire/list');
          });
        };

        $scope.removeQuestion = function(question) {
          $scope.questionnaire.questions = $scope.questionnaire.questions.filter(function(item) {
            return item !== question;
          });
        };

        $scope.removeTaggable = function(taggable) {
          $scope.questionnaire.taggable = $scope.questionnaire.taggable.filter(function(item) {
            return item.name !== taggable.name;
          });
        };
    });
});
