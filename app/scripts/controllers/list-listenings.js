'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ListListeningsCtrl
 * @description
 * # ListListeningsCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ListListeningCtrl', function ($scope, ngToast, listeningModel, Session) {
    function padZeros(str) {
        str = '' + str; // coerce to string, because Javascript.
        while (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }
    function formatDate(time) {
        // the date constructor didn't like inline maths
        var timestamp = time * 1000;
        // Date expects a timestamp with milliseconds which we've intentionally lost precision on
        var d = new Date(timestamp);
        if (isNaN(d.getTime())) {
            return 'unknown';
        } else {
            return padZeros(d.getDate()) + '/' + padZeros(d.getMonth() + 1)  + '/' + d.getFullYear() + ' ' + padZeros(d.getHours()) + ':' + padZeros(d.getMinutes());
        }
    }
    $scope.loading = true;
    listeningModel.sync().then(function(res) {
        $scope.listenings = [];
        res.rows.forEach(function(row) {
            var listening = JSON.parse(JSON.stringify(row.doc));
            listening.date = formatDate(row.doc.recordedAt);
            listening.accepted = (row.doc.type.toLowerCase() === 'rejection') ? 'N' : 'Y';
            listening.status = (row.doc.id && parseInt(row.doc.id, 10) > 0) ? 'Saved' : 'Pending';

            $scope.listenings.push(listening);
        });
        $scope.loading = false;
    }).catch(function() {
        $scope.listenings = [];
        $scope.loading = false;
    });

    $scope.filterByRole = function(element) {
        return Session.user && (Session.user.is_admin || element.userId === Session.user.id); // jshint ignore:line
    };
});
