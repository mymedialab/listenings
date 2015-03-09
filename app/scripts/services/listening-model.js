angular.module('listeningsApp').service('listeningModel', function(pouchDB) {
    'use strict';
    var db = pouchDB('listenings');
    var self = {};

    self.storeListening = function(details) {
        db.get('listenings').then(function(doc) {
            doc.data.push(details);
            db.put(doc);
        }).catch(function() {
            db.put({
                _id: 'listenings',
                data: [details]
            });
        });
    };

    self.getAllListenings = function () {
        return db.get('listenings');
    };

    return self;
});
