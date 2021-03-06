'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ListListeningsCtrl
 * @description
 * # ListListeningsCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('ListListeningCtrl', function ($scope, ngToast, listeningModel, Session) {
    var syncLimit = 5, presses = 0;

    function padZeros(str) {
        str = '' + str; // coerce to string, because Javascript.
        while (str.length < 2) {
            str = '0' + str;
        }
        return str;
    }
    function formatDate(time) {
        if (!isNaN(time)) {
            // unix timestamp in seconds from the server
            time = time * 1000;
        }

        var d = new Date(time);

        if (isNaN(d.getTime())) {
            return 'unknown';
        } else {
            return padZeros(d.getDate()) + '/' + padZeros(d.getMonth() + 1)  + '/' + d.getFullYear() + ' ' + padZeros(d.getHours()) + ':' + padZeros(d.getMinutes());
        }
    }
    $scope.loading = true;
    $scope.syncing = true;
    $scope.syncDisabled = false;

    listeningModel.sync().then(function(res) {
        $scope.listenings = [];
        res.rows.forEach(function(row) {
            var listening = JSON.parse(JSON.stringify(row.doc));

            if (typeof(listening.questionSet) === 'object') {
                listening.questionSet = listening.questionSet.name;
            }

            listening.date = formatDate(row.doc.recordedAt);
            listening.accepted = (row.doc.type.toLowerCase() === 'rejection') ? 'N' : 'Y';
            listening.status = (row.doc.id && parseInt(row.doc.id, 10) > 0) ? 'Saved' : 'Pending';

            $scope.listenings.push(listening);
            $scope.syncing = false;
        });
        $scope.loading = false;
    }).catch(function() {
        $scope.listenings = [];
        $scope.loading = false;
        $scope.syncing = false;
    });

    $scope.filterByRole = function(element) {
        return Session.user && (Session.user.is_admin || element.userId === Session.user.id); // jshint ignore:line
    };

    $scope.sync = function() {
        if (presses >= syncLimit) {
            $scope.syncDisabled = true;
            ngToast.create({
              content: 'Sync temporarily disabled, please try again shortly.',
              className: 'danger'
            });

            setTimeout(function() {
                $scope.syncDisabled = false;
                presses = 0;
            }, 60000);

            return;
        }

        presses += 1;

        $scope.syncing = true;

        listeningModel.sync().then(function() {
            $scope.syncing = false;
        }).catch(function() {
            ngToast.create({
              content: 'Failed to sync all records',
              className: 'danger'
            });

            $scope.syncing = false;
        });
    };
});
