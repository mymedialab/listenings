'use strict';

angular.module('listeningsApp').service('CurrentQuestionSetService', function() {
  var currentSelected = {
      questionSet: {},
      location: ''
    };

  return currentSelected;
});
