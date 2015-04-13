/* In the api this is a questionnaire? */
angular.module('listeningsApp').service('questionSets', function(pouchDB, $q, $http) {
    'use strict';
    var db = pouchDB('questions');
    var self = {};
    var current = {};
    var sets = [];
    var questionnaires = [];

    self.init = function() {
        $http.get('/api/questionnaires').success(function(data) {
            questionnaires = data;
        }).error(function(data) {
            questionnaires = [];
        });
    };

    var findQuestionsByName = function(name) {
         var found = sets.filter(function(input) {
            return input.name === name;
        });
        return found.length ? found[0] : false;
    };

    // @todo attempt to pull down from server and over-write current.

    self.listSets = function(fn) {
        return $q(function(resolve, reject) {

            if (sets.length) {
                if (fn && typeof(fn) === 'function') {
                    fn(sets);
                }
                resolve(sets);
                return;
            }

            db.allDocs({include_docs: true}).then(function(res) {
                var sets = [];
                res.rows.forEach(function(row) { sets.push(row.doc); });

                console.log('getlist', sets);

                if (fn && typeof(fn) === 'function') {
                    fn(sets);
                }
                resolve(sets);
            }).catch(function() {
                resolve([]);
            });
        });
    };

    self.getQuestions = function (setName) {
        console.log('looking up', setName);

        return db.get(setName);
    };

    self.create = function (details) {
        var reformattedTaggables = [];

        details.questions = details.questions || [];

        (details.taggable || []).forEach(function(taggableName) {
            reformattedTaggables.push({name: taggableName, existing: []});
        });

        console.log(details);

        details.taggable = reformattedTaggables;
        details.id       = 'pending';
        details._id      = details.name;

        return $q(function(resolve, reject) {
            db.put(details).then(resolve).catch(reject);
        });
    };

    return self;
});
