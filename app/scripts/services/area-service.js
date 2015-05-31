// {
//   _id: 'bodmin',
//   locations: [{
//     name: 'Somewhere'
//   }]
// }
angular.module('listeningsApp').service('areaService', function(syncedModel) {
    'use strict';
    var model = syncedModel.create('areas', '/api/areas/', 'areas');
    var self = {};

    function store(area) {
        if (!area.name) {
            throw "Could not create new area, missing name.";
        }
        area.locations = area.locations || [];

        return model.store(area);
    }

    function addLocationTo(location, area) {
        return model.get(area).then(function(doc) {
            doc.locations.push(location);
            return model.store(doc);
        });
    }

    self.get = model.get;
    self.getAll = model.getAll;
    self.store = store;
    self.forceSync = model.forceSync;

    self.addLocationTo = addLocationTo;

    return self;
});
