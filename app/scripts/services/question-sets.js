/* In the api this is a questionnaire? */
angular.module('listeningsApp').service('questionSets', function(pouchDB, $q, $http) {
    'use strict';
    var db = pouchDB('questionnaires');
    var self = {};
    var lastSync;

    var download = function() {
        return $http.get('/api/questionnaires').then(function(res) {
            var docs = [];
            return db.allDocs({}).then(function(existing) {
                res.data.forEach(function(row) {
                    row._id = row.name;
                    existing.rows.some(function(found) {
                        if (row._id === found.id) {
                            row._rev = found.value.rev;
                            return true;
                        }
                    });
                    docs.push(row);
                });

                return db.bulkDocs(docs).then(function() {
                    lastSync = new Date().getTime();
                    return db.allDocs({include_docs: true}); // jshint ignore:line
                });
            });
        }).catch(function() {
            return db.allDocs({include_docs: true}); // jshint ignore:line
        });
    };

    self.listSets = function() {
        // one fetch per 30 seconds
        if (lastSync && (lastSync > (new Date().getTime() - 30000))) {
            return db.allDocs({include_docs: true}); // jshint ignore:line
        }
        return download();
    };

    self.getQuestions = function (setName) {
        return db.get(setName);
    };

    self.create = function (details) {
        var reformattedTaggables = [];

        details.questions = details.questions || [];

        (details.taggable || []).forEach(function(taggableName) {
            reformattedTaggables.push({name: taggableName, existing: []});
        });

        details.taggable = reformattedTaggables;
        details.id       = 'pending';
        details._id      = details.name;

        return db.put(details).then(function() {
            return db.get(details._id);
        }).then(function(doc) {
            $http.post('/api/questionnaires', details).success(function(data) {
                doc.id = data.id;
                db.put(doc);
            });

            return db.get(details._id);
        });
    };

    return self;
});
