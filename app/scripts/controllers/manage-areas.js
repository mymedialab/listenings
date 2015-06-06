'use strict';

/**
 * @ngdoc function
 * @name listeningsApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('AreaCtrl', function ($scope, areaService, ngToast) {
    function refreshAreas() {
        areaService.getAll().then(function(res) {
            $scope.areas = res.rows.map(function(row) { return row.doc;});
        });
    }

    $scope.newArea = '';
    $scope.areas = [{name: 'loading...'}];
    refreshAreas();

    $scope.addNew = function(name) {
        if (typeof(name) !== 'string' || !name.length) {
            ngToast.create({content: 'Please enter a valid name for the new area.' , className: 'warning'});
            return;
        }
        areaService.store({name: name, locations:[]}).then(function() {
            ngToast.create({content: 'New area created.' , className: 'success'});
            refreshAreas();
        }).catch(function() {
            ngToast.create({content: 'Area creation failed.' , className: 'danger'});
        });
    };
});
