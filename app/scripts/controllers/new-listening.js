'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($scope, $location, listeningModel, questionSets) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    $scope.placeholder = function() {
        var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));
        return ridiculousPlaceholders[rand];
    };

    $scope.recordNotInterested = function(location, selectedSet) {
        var rejection = {
            type: 'rejection',
            location: location,
            questionSet: selectedSet.name
        };
        listeningModel.storeListening(rejection);
    };
    $scope.createNew = function(location, selectedSet) {
        $location.redirect('/listening/record/' + encodeURIComponent(location) + '/' + encodeURIComponent(selectedSet.name));
    };

    $scope.questionTypes = [];
    questionSets.listSets().then(function(res) {
        $scope.questionTypes = res.sets;
    }).catch(function() {
        // @todo error handling!
    });

    listeningModel.getAllListenings().then(function(res) {
        $scope.db = res;
    });
});
