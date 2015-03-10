'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($scope, $location, ngToast, listeningModel, questionSets) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));
    $scope.placeholder = ridiculousPlaceholders[rand];

    $scope.recordNotInterested = function(location, selectedSet) {
        var rejection = {
            type: 'rejection',
            location: location,
            questionSet: selectedSet.name
        };
        listeningModel.storeListening(rejection);
    };

    $scope.createNew = function(location, selectedSet) {
        $location.path('/listening/record/' + encodeURIComponent(location) + '/' + encodeURIComponent(selectedSet.name));
    };

    $scope.questionTypes = [];
    questionSets.listSets().then(function(res) {
        $scope.questionTypes = res.sets;
    }).catch(function() {
        ngToast.create({content:'Could not fetch details from server. Please try again.', className: 'danger'});
    });

    listeningModel.getAllListenings().then(function(res) {
        $scope.db = res;
    });
});
