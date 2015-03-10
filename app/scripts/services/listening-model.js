angular.module('listeningsApp').service('listeningModel', function(pouchDB, $q) {
    'use strict';
    var db = pouchDB('listenings');
    var self = {};

    self.storeListening = function(details) {
        return $q(function(resolve) {
            db.get('listenings').then(function(doc) {
                doc.data.push(details);
                db.put(doc);
                resolve(doc);
            }).catch(function() {
                var doc = {
                    _id: 'listenings',
                    data: [details]
                };
                db.put();
                resolve(doc);
            });
        });
    };

    self.getAllListenings = function () {
        return db.get('listenings');
    };

    return self;
});
