/**
 * A synced model uses pouchDb locally to hold as much of the data as it can, then pushes to mysql
 * when a connection is available.
 *
 * @param  {[type]} pouchDB [description]
 * @param  {[type]} Session [description]
 * @param  {[type]} $http   [description]
 * @param  {[type]} $q      [description]
 * @return {[type]}         [description]
 */
angular.module('listeningsApp').factory('syncedModel', function(pouchDB, Session, $http, $q) {
    'use strict';
    function dateUtc() {
        var date = new Date();
        return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 1000);
    }

    /**
     * This is the generic model which can be created by the parent factory.
     *
     * @param {string} pouchDbName
     * @param {string} url
     * @param {string} humanName
     * @param {int} syncInterval [optional] the refresh interval in milliseconds. Defaults to 10000 (10 seconds)
     * @param {function} transformForServer
     * @param {function} transformForLocal
     */
    var Model = function(pouchDbName, url, humanName, syncInterval, transformForServer, transformForLocal) {
        var db = pouchDB(pouchDbName),
            dirty = true,
            lastSynced = null,
            self = this,

            trimDb = function(remoteRows, localRows) {
                var ids = remoteRows.map(function(row) {
                    return row.id;
                });

                localRows.filter(function(local) {
                    if (local.doc.id === 'pending') {
                        // This row not yet synced.
                        return true;
                    } else if (ids.indexOf(local.doc.id) !== -1) {
                        // found this row. Any extra need de-duping
                        ids.splice(ids.indexOf(local.doc.id), 1);
                        return true;
                    } else {
                        db.remove(local.doc);
                        return false;
                    }
                });

                return localRows;
            },

            pushAllPending = function() {
                return db.allDocs({ include_docs: true }).then(function(docs) {
                    return $q.all(docs.rows.forEach(function(doc) {
                        doc = doc.doc;
                         if (doc.id && doc.id !== 'pending') {
                            return;
                        }
                        doc = transformForServer(doc);
                        return $http.post(url, doc).then(function(response) {
                            if (response.data && response.data.id) {
                                console.log(doc);
                                doc.id = response.data.id;
                                return db.put(doc);
                            }
                        });
                    }));
                });
            },

            updateShared = function() {
                var remote = [],
                    docs = [];

                return $http.get(url, {timeout: 1000}).then(function(res) {
                    remote = res.data;
                    return db.allDocs({include_docs: true}); // jshint ignore:line
                }).then(function(localResponse) {
                    var existing = trimDb(remote, localResponse.rows);
                    // We loop through remote rows and reformat them as local.
                    // Then, if a local row exists, we overwrite it in the local DB,
                    // if it's new, we insert it.
                    remote.forEach(function(row) {
                        row = transformForLocal(row);

                        existing.some(function(current) {
                            if (current.doc.id === row.id) {
                                row._id = current.doc._id;
                                row._rev = current.doc.rev;
                                return true; // found. Stop looking
                            }
                        });

                        docs.push(row);
                    });

                    return db.bulkDocs(docs);
                });
            },

            sync = function(force) {
                var now = new Date().getTime();

                if ((!dirty && !force) || (lastSynced + 1000) > now) {
                    // hard stop this from running more than once a second.
                    return;
                }

                dirty = false;
                lastSynced = now;
                return $q.all([
                    pushAllPending(),
                    updateShared()
                ]);
            };


        self.getAll = function () {
            return db.allDocs({ include_docs: true }); // jshint ignore:line
        };

        self.get = function (id) {
            return db.get(id);
        };

        self.store = function (details) {
            /* _id is the local pouchDb identifier, and id is the canonical MySQL identifier. We may not be able to get that for a while, so it is pending. */
            details._id = details._id || Session.user.id + '/' + dateUtc();
            details.id = 'pending';
            dirty = true;
            return db.put(details);
        };

        /**
         * @return {Promise}
         */
        self.forceSync = function() {
            return sync(true);
        };

        transformForServer = transformForServer || function(localRow) { return localRow; };
        transformForLocal = transformForLocal || function(remoteRow) { return remoteRow; };

        // default to 10 seconds
        syncInterval = syncInterval || 10000;

        window.setInterval(sync, syncInterval); // sync every n seconds if dirty.

        // every 1000 intervals, force a sync to pull any changes.
        window.setInterval(function() {
            dirty = true;
        }, syncInterval * 1000);

        return self;
    };

    return {
        create: function(pouchDbName, url, humanName, transformForServer, transformForLocal) {
            return new Model(pouchDbName, url, humanName, 10000, transformForServer, transformForLocal);
        }
    };
});
