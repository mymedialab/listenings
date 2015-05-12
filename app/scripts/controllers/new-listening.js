'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($log, $scope, $location, ngToast, listeningModel, locationModel, questionSets, CurrentQuestionSetService) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));
    $scope.placeholder = ridiculousPlaceholders[rand];
    $scope.houseno = '';
    $scope.locations = [];
    locationModel.all().then(function(res) {
        $scope.locations = res;
    });

    $scope.recordNotInterested = function(location, houseno, selectedSet) {
        var rejection;

        if (typeof(location) === 'object') {
          location = location[0].text;
        }

        rejection = {
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

        location = (typeof(location) === 'string') ? location : location[0].text;
        $location.path('/listening/record/' + encodeURIComponent(location) + '/' + encodeURIComponent(selectedSet.name) + '/' + encodeURIComponent(houseno));
    };

    // questionTypes is the questionnaire
    $scope.questionTypes = [];
    questionSets.listSets().then(function(res) {
        $scope.questionTypes = res.rows.map(function(row) {
            return row.doc;
        });
        if (CurrentQuestionSetService.selectedSet) {
            $scope.questionTypes.some(function(item) {
                if (CurrentQuestionSetService.selectedSet._id === item._id) {
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
