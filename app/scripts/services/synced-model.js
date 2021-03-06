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

    function remoteModified(remote, local) {
        var localLast = new Date(local.last_updated),
            remoteLast = new Date(remote.last_updated);

        if (!isNaN(localLast) && !isNaN(remoteLast)) {
            return (remoteLast.getTime() > localLast.getTime()); // if equal, return false!
        } else if (!isNaN(remoteLast)) {
            /* We don't know when the local was last updated, so assume it's oldest. Remote seems ok. */
            return true;
        }

        return false; // if neither have dates, they were created prior to this object working, so let them be.
    }

    function localModified(remote, local) {
        var delta,
            localLast = new Date(local.last_updated).getTime(),
            remoteLast = new Date(remote.last_updated).getTime();

        if (!isNaN(localLast) && !isNaN(remoteLast)) {
            delta = localLast - remoteLast;
            return (delta > 1000); // more than a second difference
        } else if (!isNaN(localLast)) {
            /* We don't know when the remote was last updated, so assume it's oldest. Local seems ok. */
            return true;
        }

        return false; // if neither have dates, they were created prior to this object working, so let them be.
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

            /**
             * This is fairly easy. if there are entries in local, not in remote then they've been deleted so
             * clear them away.
             */
            trimDb = function(remoteRows, localRows) {
                var ids = remoteRows.map(function(row) {
                    return row.id;
                });

                localRows.filter(function(local) {
                    if (local.doc.id === 'pending') {
                        // This row not yet synced.
                        return true;
                    } else if (ids.indexOf(local.doc.id) !== -1) {
                        // found this row. Any extra need de-duping. Could cause data loss, but tough.
                        ids.splice(ids.indexOf(local.doc.id), 1);
                        return true;
                    } else {
                        db.remove(local.doc);
                        return false;
                    }
                });

                return localRows;
            },

            /**
             * This is dead easy, anything pending is an insert, so send it off.
             */
            pushAllPending = function() {
                return db.allDocs({ include_docs: true }).then(function(docs) {
                    return $q.all(docs.rows.forEach(function(doc) {
                        doc = doc.doc;
                         if (doc.id && doc.id !== 'pending') {
                            return;
                        }
                        doc = transformForServer(doc);
                        // @todo if we've been offline for a while there may be a few of these. Can we rate limit or batch pushes?
                        return $http.post(url, doc).then(function(response) {
                            if (response.data && response.data.id) {
                                doc.id = response.data.id;
                                return db.put(doc);
                            }
                        });
                    }));
                });
            },

            updateRemote = function(data) {
                return $http.put(url + data.id, data);
            },

            /**
             * This is pretty hard. If the record exists in both, we either want to leave it, pull changes or push
             * changes.
             */
            updateShared = function() {
                var remote = [],
                    docs = [];

                /* first, get stuff. */
                return $http.get(url, {timeout: 1000}).then(function(res) {
                    remote = res.data;
                    return db.allDocs({include_docs: true}); // jshint ignore:line
                }).then(function(localResponse) {
                    var found;
                    var existing = trimDb(remote, localResponse.rows);
                    // We loop through remote rows and reformat them as local.
                    // Then, if a local row exists, we overwrite it in the local DB,
                    // if it's new, we insert it.
                    remote.forEach(function(row) {
                        row = transformForLocal(row);

                        found = existing.some(function(current) {
                            if (current.doc.id === row.id) {
                                if (remoteModified(row, current.doc)) {
                                    // overwrite local with remote
                                    row._id = current.doc._id;
                                    row._rev = current.doc._rev;
                                    docs.push(row);
                                } else if (localModified(row, current.doc)) {
                                    // push changes.
                                    updateRemote(transformForServer(current.doc));
                                }
                                return true; // found. Stop looking
                            }
                        });

                        // if we didn't find the row in local, we need to add it.
                        if (!found) {
                            docs.push(row);
                        }
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
            if (lastSynced === null) {
                return sync().then(function() {
                    return db.allDocs({ include_docs: true }); // jshint ignore:line
                });
            } else {
                return db.allDocs({ include_docs: true }); // jshint ignore:line
            }
        };

        self.get = function (id) {
            return db.get(id);
        };

        self.store = function (details) {
            /* _id is the local pouchDb identifier, and id is the canonical MySQL identifier. We may not be able to get that for a while, so it is pending. */
            details._id = details._id || Session.user.id + '-' + dateUtc();
            details.id = details.id || 'pending';
            details.last_updated = new Date().getTime();
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
        transformForLocal = transformForLocal || function(remoteRow) {
            if (remoteRow.updated_at && !remoteRow.last_updated) {
                /* Laravel convetional dates, not adjusted for JS. Fix here. */
                remoteRow.last_updated = remoteRow.updated_at;
            }
            return remoteRow;
        };

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
