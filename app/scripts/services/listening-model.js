/**
 * an Interview document uses the user id and the recordedAt timestamp for the document ID.
 *
 * This should be sufficient to make interviews unique
 * a double-bounce save for instance will resolve to the same document
 */
angular.module('listeningsApp').service('listeningModel', function(pouchDB, $q, $http, Session) {
    'use strict';
    var db   = pouchDB('interviews');
    var self = {};

    self.storeListening = function(details) {
        var date     = new Date();
        var time     = date.getTime(); //milliseconds
        var now = Math.floor(time / 1000);

        details.recordedAt = now;
        details.id         = 'pending';
        details._id        = Session.user.id + '/' + now;

        return db.put(details);
    };

    self.getAllListenings = function () {
        return db.allDocs({ include_docs: true }); // jshint ignore:line
    };

    /**
     * work out what needs syncing and make it so
     */
    self.sync = function() {
        $http.get('/api/interviews').success(function(data) {
            data.forEach(function(row) {
                var id, doc = {};
                var date = new Date(row.date);
                // adjust the date for timezone, this ensures that times match the stored (UTC) _id values
                var dateUtc = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 1000);

                id = row.interviewer_id + '/' + dateUtc; // jshint ignore:line

                doc = {
                    _id: id,
                    id: row.id,
                    type: row.type,
                    questionSet: row.questionnaire && row.questionnaire.name || 'unknown',
                    location: row.location,
                    questions: row.responses,
                    recordedAt: date,
                    last_updated: row.updated_at // jshint ignore:line
                };

                db.put(doc);
            });
        }).error(function(data, status) {
            console.log('error', status);
        });

        // send what we've got to the server
        return db.allDocs({ include_docs: true }).then(function(res) {  // jshint ignore:line
            res.rows.forEach(function(row) {
                var doc = row.doc;

                if (doc.id !== 'pending') {
                    return;
                }

                $http.post('/api/interviews', doc).success(function(data) {
                    doc.id          = data.id;
                    doc.last_synced = data.updated_at; // jshint ignore:line

                    db.put(doc, doc._id, (new Date().toISOString())).catch(function(err) {
                        // I'm pretty sure _rev doesn't work this way...
                        console.log('failed to save', doc._id, ',', err);
                    });
                }); // todo: error is ignored because id will remain 'pending', maybe handle it better
            });

            return db.allDocs({ include_docs: true }); // jshint ignore:line
        });
    };

    return self;
});
