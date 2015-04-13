/* In the API a listening is an interview */
angular.module('listeningsApp').service('listeningModel', function(pouchDB, $q, $http) {
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
        db.allDocs({ include_docs: true }).then(function(res) {
            console.log(res);
            // sync pending
            res.rows.forEach(function(row, index) {
                if (row.doc.id != 'pending') {
                    return;
                }

                $http.post('/api/listenings', { set: row.doc }).
                    success(function(data) {
                        row.doc.id = data.mysql_id; // assign the saved id.
                      }).
                    error(function(data, status) {
                        var statusType = status / 100;

                        if (statusType === 5) {
                            console.log('server error on sync');
                            return;
                        }

                        if (statusType === 4) {
                            console.log('client error on sync');
                            return;
                        }

                        console.log('unknown error on sync');
                    });
            });
        });
    };

    return self;
});
