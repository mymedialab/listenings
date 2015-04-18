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
            .then(function(data) {
                results = ['success!'];
                return results;
            })
            .catch(function(err) {
                return db.allDocs({include_docs: true}).then(function(res) {
                    var rows = res.rows.map(function() {

                    });
                    return rows;
                });
            });
    };

    return self;
});
