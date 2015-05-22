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
        area.name      = area.name || '';
        area._id      = area._id || area.name;
        area.locations = area.locations || [];

        return db.put(area).catch(function() {
            return db.get(area.name).then(function(doc) {
                return Promise.resolve(doc);
            });
        }).then(function(doc) {
            return db.put(doc, doc._id, doc._rev);
        });
    }

    function addLocationTo(location, area) {
        return db.get(area).then(function(doc) {
            doc.locations.push(location);
            return db.put(doc, doc._id, doc._rev);
        }).then(storeArea).catch(function(err) {
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
                return db.allDocs({ include_docs: true });
            })
            .catch(function(err) {
                $log.error(err.status + ' ' + err.statusText);
            });
    }

    self.get = function(name) {
        return db.get(name);
    };

    self.all = sync;
    self.save = storeArea;
    self.sync = sync;
    self.addLocationTo = addLocationTo;

    return self;
});
