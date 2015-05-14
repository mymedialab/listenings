/**
 * an Interview document uses the user id and the recordedAt timestamp for the document ID.
 *
 * This should be sufficient to make interviews unique
 * a double-bounce save for instance will resolve to the same document
 */
angular.module('listeningsApp').service('listeningModel', function(pouchDB, $http, Session, $log) {
    'use strict';
    var db   = pouchDB('interviews');
    var self = {};

    self.storeListening = function(details) {
        var date = new Date();
        var time = date.getTime(); //milliseconds
        var now  = Math.floor(time / 1000);

        details.recordedAt = now;
        details.id         = 'pending';
        details._id        = Session.user.id + '/' + now;
        details.userId     = Session.user.id;

        return db.put(details);
    };

    self.getAllListenings = function () {
        return db.allDocs({ include_docs: true }); // jshint ignore:line
    };

    self.find = function(id) {
        return db.get(id);
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
                    houseno: row.houseno,
                    questions: row.responses,
                    recordedAt: date,
                    last_updated: row.updated_at, // jshint ignore:line
                    userId: row.interviewer_id // jshint ignore:line
                };

                db.put(doc);
            });
        }).error(function(data, status) {
            $log.error('Failed to retrieve listenings from the server with status: ' + status, data);
        });

        // send what we've got to the server
        // @todo batch submit these
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
                        $log.error('failed to save ' + doc._id + ', ' + err);
                    });
                }).error(function(data, status) {
                    $log.error('Failed to send listenings to the server with status: ' + status, data);
                }); // @todo: really I want to return this promise to let my controller generate toasts and stuff.
            });

            return db.allDocs({ include_docs: true }); // jshint ignore:line
        });
    };

    return self;
});
