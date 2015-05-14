'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ListListeningsCtrl
 * @description
 * # ListListeningsCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ListQuestionnairesCtrl', function ($scope, questionSets) {
    $scope.loading = true;
    questionSets.listSets().then(function(res) {
        $scope.questionnaires = res.rows.map(function(row) { return row.doc; });
        $scope.loading        = false;
    });
});
