/* In the API a listening is an interview */
angular.module('listeningsApp').service('listeningModel', function(pouchDB, $q, $http, Session) {
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
        return db.allDocs({ include_docs: true });
    };

    /**
     * work out what needs syncing and make it so
     */
    self.sync = function() {
        // send what we've got to the server
        db.allDocs({ include_docs: true }).then(function(res) {
            res.rows.forEach(function(row) {
                var doc = row.doc;

                if (doc.id !== 'pending') {
                    return;
                }

                $http.post('/api/interviews', doc).success(function(data) {
                    Session
                    doc.id   = data.id;
                    db.put(doc, doc._id, (new Date().toISOString())).catch(function(err) {
                        console.log('failed to save', doc.id, ',', err);
                    });
                });
            });
        });
    };

    return self;
});
