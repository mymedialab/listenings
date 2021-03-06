'use strict';

/**
 * @ngdoc function
 * @name listenings.controller:RecordListeningCtrl
 * @description
 * # RecordListeningCtrl
 * Controller of the listeningsApp
 */
angular.module('listeningsApp').controller('RecordListeningCtrl', function ($scope, $location, ngToast, listeningModel, questionSets, CurrentQuestionSetService) {
    var cloneObj = function(obj) {
        return (obj) ? JSON.parse(JSON.stringify(obj)) : null;
    };

    if (!CurrentQuestionSetService.selectedSet) {
        $location.path('/listening/new');
        return;
    }

    $scope.loading = true;
    $scope.answers = {
        type : 'interview',
        questionSet : CurrentQuestionSetService.selectedSet,
        location : CurrentQuestionSetService.location,
        houseno : CurrentQuestionSetService.houseno,
        area : CurrentQuestionSetService.area
    };

    $scope.save = function(answers) {
        var listening = cloneObj(answers);
        // reformat for the model, reduce the array of objects down to an array of strings
        if (listening.taggable) {
            listening.taggable.forEach(function(taggable) {
                taggable.tagged = taggable.tagged.map(function(obj) {
                    return obj.text;
                });
                delete taggable.existing;
            });
        }

        listeningModel.storeListening(listening).then(function() {
            ngToast.create({content:'Saved successfully.', className: 'success'});
            $location.path('/listening/new');
        }).catch(function() {
            ngToast.create({content:'Interview not saved. Please try again.', className: 'danger'});
        });

        listeningModel.sync();
    };

    questionSets.getQuestions(CurrentQuestionSetService.selectedSet._id).then(function(res) {
        var reformattedQuestions = [];
        var questionnaire = cloneObj(res);

        // reformat for the html
        if (questionnaire.taggable) {
            questionnaire.taggable.forEach(function(taggable) {
                var reformattedTags = [];
                if (taggable.existing) {
                    taggable.existing.forEach(function(tagText) {
                        reformattedTags.push({text: tagText});
                    });
                }
                taggable.existing = reformattedTags;

            });

            questionnaire.taggable.filterTags = function(query, tags) {
                return tags.filter(function(tag) {
                    if (tag && tag.indexOf) {
                        return tag.indexOf(query) > -1;
                    }
                });
            };
        }

        if (questionnaire.questions) {
            questionnaire.questions.forEach(function(question) {
                reformattedQuestions.push({question: question, answer: ''});
            });
        }

        $scope.answers.taggable = questionnaire.taggable;
        $scope.answers.questions = reformattedQuestions;
        $scope.loading = false;
    });
});
