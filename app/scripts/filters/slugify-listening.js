'use strict';

angular.module('listeningsApp').filter('slugify', function() {
  return function(input) {
    if (!input) {
      return;
    }
    return input.replace('/', '-');
  };
});
