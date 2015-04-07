angular.module('listeningsApp').service('listeningModel', function(pouchDB, $q) {
    'use strict';
    var db = pouchDB('listenings');
    var self = {};

    self.storeListening = function(details) {
        return $q(function(resolve) {
            details.recordedAt = new Date().getTime();
            details.id  = 'pending';
            details._id = new Date().toISOString();

            db.put(details).then(function(doc) {
                resolve(doc);
            });
        });
    };

    self.getAllListenings = function () {
        return db.allDocs({include_docs: true});
    };

    return self;
});
