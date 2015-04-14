/* In the api this is a questionnaire? */
angular.module('listeningsApp').service('questionSets', function(pouchDB, $q, $http) {
    'use strict';
    var db = pouchDB('questionnaires');
    var self = {};

    var download = function() {
        return $http.get('/api/questionnaires').success(function(data) {
            var docs = [];

            data.forEach(function(row) {
                row._id = row.name;
                docs.push(row);
            });

            return db.bulkDocs(docs).then(function() {
                return db.allDocs({include_docs: true}); // jshint ignore:line
            });
        }).error(function() {
            return db.allDocs({include_docs: true}); // jshint ignore:line
        });
    };

    self.listSets = function() {
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
