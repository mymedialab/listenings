'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:RecordListeningCtrl
 * @description
 * # RecordListeningCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('RecordListeningCtrl', function ($scope, $routeParams, $location, ngToast, listeningModel, questionSets) {
    var cloneObj = function(obj) {
        return (obj) ? JSON.parse(JSON.stringify(obj)) : null;
    };
    $scope.loading = true;
    $scope.location = $routeParams.location;
    $scope.answers = {name: 'Loading'};

    $scope.save = function(answers) {
        var listening = cloneObj(answers);
        // reformat for the model, reduce the array of objects down to an array of strings
        listening.taggable.forEach(function(taggable) {
            taggable.tagged = taggable.tagged.map(function(obj) {
                return obj.text;
            });
            delete taggable.existing;
        });

        listeningModel.storeListening(listening).then(function() {
            ngToast.create({content:'Saved successfully.', className: 'success'});
            $location.path('/listening/new');
        }).catch(function() {
            ngToast.create({content:'Interview not saved. Please try again.', className: 'danger'});
        });
    };

    questionSets.getQuestions($routeParams.set).then(function(res) {
        var reformattedQuestions = [], reformattedTaggables = [];
        $scope.answers = cloneObj(res);

        // reformat for the html
        $scope.answers.taggable.forEach(function(taggable, index) {
            var reformattedTags = [];
            if (taggable.existing) {
                taggable.existing.forEach(function(tagText) {
                    reformattedTags.push({text: tagText});
                });
            }
            $scope.answers.taggable[index].existing = reformattedTags;
        });
        $scope.answers.questions.forEach(function(question) {
            reformattedQuestions.push({question: question, response: ''});
        });

        $scope.answers.questions = reformattedQuestions;
        $scope.loading = false;
    });
});
