angular.module('listeningsApp').service('locationModel', function(pouchDB, $http) {
    'use strict';

    var self = {};
    var db = pouchDB('locations');

    function fetchFromServer() {
        return $http.get('/api/locations');
    }

    self.all = function() {
        var results = ['something?'];

        return fetchFromServer()
            .then(function(res) {
                var all = res.data.map(function(row) {
                    var doc = {_id: row.location}; /* this is a flat array, so pop the bit we want as an id. */
                    db.put(doc); // will auto de-dupe too!
                    return row.location;
                });
                return all;
            })
            .catch(function(err) {
                return db.allDocs().then(function(res) {
                    var all = res.rows.map(function(row) {
                        return row.id;
                    });
                    return all;
                });
            });
    };

    return self;
});
