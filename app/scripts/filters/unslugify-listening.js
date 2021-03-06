'use strict';

angular.module('listeningsApp').filter('unslugify', function() {
  return function( str ) {
    if (!str || typeof(str) !== 'string') {
      return str;
    }
    return decodeURIComponent(window.escape(window.atob( str )));
  };
});
