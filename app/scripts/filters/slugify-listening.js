'use strict';

angular.module('listeningsApp').filter('slugify', function() {
  return function( str ) {
    if (!str || typeof(str) !== 'string') {
      return str;
    }
    return window.btoa(unescape(encodeURIComponent( str )));
  }
});
