'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('NewListeningCtrl', function ($log, $scope, $location, ngToast, listeningModel, areaService, questionSets, CurrentQuestionSetService) {
    var ridiculousPlaceholders = ['Evergreen Terrace, Springfield', 'Diagon Alley, London', 'Baker Street, Marylebone', 'Albert Square, Walford', 'Rainey Street, Arlen'];
    var rand = Math.floor(Math.random() * (ridiculousPlaceholders.length));

    $scope.placeholder = ridiculousPlaceholders[rand];
    $scope.houseno = '';
    $scope.locations = [];

    areaService.all().then(function(res) {
        $scope.areas = res.rows.map(function(row) { return row.doc; });
    }).catch(function() {
        $scope.areas = [];
    });

    $scope.recordNotInterested = function(area, location, houseno, selectedSet) {
        var rejection;

        if (typeof(location) === 'object') {
          location = location[0].text;
        }

        if (typeof(area) === 'object') {
          area = area.name;
        }

        console.log(arguments);

        rejection = {
            type: 'rejection',
            area: area,
            location: location,
            houseno: houseno,
            questionSet: selectedSet.name
        };
        listeningModel.storeListening(rejection).then(listeningModel.sync);
        ngToast.create({content:'Rejection noted.', className: 'success'});
    };

    $scope.createNew = function(area, location, houseno, selectedSet) {
        console.log('createnew:', [area, location, houseno, selectedSet]);

        location = (typeof(location) === 'string') ? location : location[0].text;
        area     = (typeof(area) === 'string') ? area : area.name;

        CurrentQuestionSetService.area        = area;
        CurrentQuestionSetService.location    = location;
        CurrentQuestionSetService.houseno     = houseno;
        CurrentQuestionSetService.selectedSet = selectedSet;

        $location.path('/listening/record/');
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
            $scope.houseno  = CurrentQuestionSetService.houseno  || '';
            $scope.area     = CurrentQuestionSetService.area     || '';
        }
    }).catch(function() {
        ngToast.create({content:'Could not fetch details from server. Please try again.', className: 'danger'});
    });

    /**
     * provide proper filtering on tag list autocomplete
     */
    $scope.filterLocations = function(query) {
        return $scope.locations.filter(function(tag) { return tag.indexOf(query) > -1; });
    };

    $scope.areaChanged = function(area) {
        if (!area) {
            $scope.locations = [];
            return;
        }

        $scope.locations = area.locations.map(function(location) { return location.name; });
    };
});
