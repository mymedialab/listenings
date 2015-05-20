'use strict';

angular.module('listeningsApp').service('CurrentQuestionSetService', function() {
  var currentSelected = {
      questionSet: {},
      area: {},
      location: '',
      houseno: ''
    };

  return currentSelected;
});
