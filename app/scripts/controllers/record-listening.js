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

        listeningModel.sync();
    };

    console.log('questionssss!>');

    questionSets.getQuestions($routeParams.set).then(function(res) {
        var reformattedQuestions = [];
        var question = cloneObj(res);

        // reformat for the html
        console.log('questionssss', res);

        question.taggable.forEach(function(taggable) {
            var reformattedTags = [];
            if (taggable.existing) {
                taggable.existing.forEach(function(tagText) {
                    reformattedTags.push({text: tagText});
                });
            }
            taggable.existing = reformattedTags;
            console.log('tags', taggable);
        });
        question.questions.forEach(function(question) {
            console.log('question', question);
            reformattedQuestions.push({question: question, response: ''});
        });

        $scope.answers.taggable = question.taggable;
        $scope.answers.questions = reformattedQuestions;
        $scope.loading = false;
    }).catch(function(a) {console.log('fuicked', a)});
});
