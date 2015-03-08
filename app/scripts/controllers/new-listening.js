'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($scope, $location, localDb) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    $scope.placeholder = function() {
        var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));
        return ridiculousPlaceholders[rand];
    };

    $scope.recordNotInterested = function(location) {
        var rejection = {
            type: 'rejection',
            location: location
        };
        localDb.storeListening(rejection);
    };
    $scope.createNew = function(location) {
        $location.redirect('/listening/record/' + location);
    };

    localDb.getAllListenings().then(function(res) {
        $scope.db = res;
    });
});
