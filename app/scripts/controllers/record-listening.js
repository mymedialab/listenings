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
    $scope.answers = {
        type : 'interview',
        questionSet : $routeParams.set,
        location : $routeParams.location
    };

    $scope.save = function(answers) {
        var listening = cloneObj(answers);
        // reformat for the model, reduce the array of objects down to an array of strings
        listening.taggable && listening.taggable.forEach(function(taggable) {
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

        listeningModel.sync();
    };

    questionSets.getQuestions($routeParams.set).then(function(res) {
        var reformattedQuestions = [];
        var questionnaire = cloneObj(res);

        // reformat for the html
        questionnaire.taggable && questionnaire.taggable.forEach(function(taggable) {
            var reformattedTags = [];
            if (taggable.existing) {
                taggable.existing.forEach(function(tagText) {
                    reformattedTags.push({text: tagText});
                });
            }
            taggable.existing = reformattedTags;
            console.log('tags', taggable);
        });

        console.log('tags:', questionnaire.taggable);
        console.log('questions:', questionnaire.questions);

        questionnaire.questions && questionnaire.questions.forEach(function(question) {
            reformattedQuestions.push({question: question, response: ''});
        });

        $scope.answers.taggable = questionnaire.taggable;
        $scope.answers.questions = reformattedQuestions;
        $scope.loading = false;
    });
});
