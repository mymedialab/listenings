// {
//   _id: 'bodmin',
//   locations: [{
//     name: 'Somewhere'
//   }]
// }
angular.module('listeningsApp').service('areaService', function(pouchDB, $http, $log) {
    'use strict';

    var self = {};
    var db   = pouchDB('areas');

    function storeArea(area) {
        console.log(area);
        return db.upsert(area, function(existing) {
            console.log(existing);
            if (!existing._id) {
                // new record
                area._id = area.name;
                return area;
            }

            area._id = existing._id;
            return area;
        }).then(function(res) {
            console.log(res);
            return Promise.resolve(res);
        });
    }

    function addLocationTo(location, area) {
        return db.get(area).then(function(doc) {
            doc.locations.push(location);
            return db.put(doc, doc._id, doc._rev);
        }).then(function(doc) {
            storeArea(doc);
        }).catch(function(err) {
            $log.error(err);
        });
    }

    function sync() {
        return $http.get('/api/areas')
            .then(function(response) {
                var areas = response.data.areas || [];
                return Promise.all(areas.map(function(area) {
                    storeArea(area);
                }));
            })
            .then(function() {
                return db.allDocs({ include_doc: true });
            })
            .catch(function(err) {
                $log.error(err.status + ' ' + err.statusText);
            });
    }

    self.all = function() {
        return sync().then(function() {
            return db.allDocs({ include_doc: true });
        });
    };

    self.get = function(name) {
        return db.get(name);
    };

    self.save = storeArea;
    self.sync = sync;
    self.addLocationTo = addLocationTo;

    return self;
});
