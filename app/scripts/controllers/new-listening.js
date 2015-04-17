'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($scope, $location, ngToast, listeningModel, questionSets, CurrentQuestionSetService) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));
    $scope.placeholder = ridiculousPlaceholders[rand];

    $scope.recordNotInterested = function(location, houseno, selectedSet) {
        var rejection = {
            type: 'rejection',
            location: location,
            houseno: houseno,
            questionSet: selectedSet.name
        };
        listeningModel.storeListening(rejection).then(listeningModel.sync());
        ngToast.create({content:'Rejection noted.', className: 'success'});
    };

    $scope.createNew = function(location, houseno, selectedSet) {
        CurrentQuestionSetService.selectedSet = selectedSet;
        CurrentQuestionSetService.location = location;
        CurrentQuestionSetService.houseno = houseno;

        $location.path('/listening/record/' + encodeURIComponent(location) + '/' + encodeURIComponent(selectedSet.name));
    };

    // questionTypes is the questionnaire
    $scope.questionTypes = [];
    questionSets.listSets().then(function(res) {
        $scope.questionTypes = res.data;
        if (CurrentQuestionSetService.selectedSet) {
            res.data.some(function(item) {
                if (CurrentQuestionSetService.selectedSet.id === item.id) {
                    $scope.selectedSet = item;
                    return true;
                }
            });
            $scope.location = CurrentQuestionSetService.location || '';
            $scope.houseno = CurrentQuestionSetService.houseno || '';
        }
    }).catch(function() {
        ngToast.create({content:'Could not fetch details from server. Please try again.', className: 'danger'});
    });
});
