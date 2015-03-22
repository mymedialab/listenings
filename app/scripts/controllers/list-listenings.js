'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ListListeningsCtrl
 * @description
 * # ListListeningsCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ListListeningCtrl', function ($scope, ngToast, listeningModel) {
    function padZeros(str) {
        str = "" + str; // coerce to string, because Javascript.
        while (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }
    function formatDate(time) {
        var d = new Date(time);
        return (isNaN(d.getTime())) ? 'unknown' : padZeros(d.getDate()) + '/' + padZeros(d.getMonth() + 1)  + '/' + d.getFullYear() + ' ' + padZeros(d.getHours()) + ':' + padZeros(d.getMinutes());
    }
    $scope.loading = true;
    listeningModel.getAllListenings().then(function(res) {
        $scope.listenings = res.data;
        $scope.listenings.forEach(function(listening) {
            listening.date = formatDate(listening.recordedAt);
            listening.accepted = (listening.type.toLowerCase() === 'rejection') ? 'N' : 'Y';
            listening.status = (listening.mysqlId && parseInt(listening.mysqlId, 10) > 0) ? 'Stored (' + listening.mysqlId + ')' : 'pending';
        });
        $scope.loading = false;
    }).catch(function() {
        $scope.listenings = [];
        $scope.loading = false;
    });
});
