angular.module('listeningsApp').service('localDb', function(pouchDB) {
    'use strict';
    return pouchDB('listenings');
});
