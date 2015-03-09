angular.module('listeningsApp').service('questionSets', function(pouchDB, $q) {
    'use strict';
    var db = pouchDB('questions');
    var self = {};
    var sets = [];

    var findQuestionsByName = function(name) {
         var found = sets.filter(function(input) {
            return input.name === name;
        });
        return found.length ? found[0] : false;
    };

    // @todo attempt to pull down from server and over-write current.

    self.listSets = function() {
        return $q(function(resolve, reject) {
            db.get('sets').then(function(res) {
                if (res.sets) {
                    sets = res.sets;
                    resolve(res);
                } else {
                    reject(res);
                }
            }).catch(reject);
        });
    };

    self.getQuestions = function (setName) {

        return $q(function(resolve, reject) {
            if (sets.length) {
                resolve(findQuestionsByName(setName));
                return;
            }
            db.get('sets').then(function(res) {
                if (res.sets) {
                    sets = res.sets;
                    resolve(findQuestionsByName(setName));
                } else {
                    reject(res);
                }
            }).catch(reject);
        });
    };

    // @todo this needs to come from the server
    self.reset = function() {
         db.get('sets').then(function(res) {
            db.put({
                _id: 'sets',
                lastUpdated: new Date().getMilliseconds(),
                _rev: res._rev,
                sets: [
                    {'name': 'Likes and concerns', questions: ['What like?', 'Were you hugged enough as a child?', 'OO R YA?'], taggable: [{name: 'likes', existing:['this', 'that', 'the other']}]},
                    {'name': 'Some other question set!', questions: ['Why am I here?', 'What do I want from this?', 'Who even asked you anyway?'], taggable: [{name: 'likes', existing:['this', 'that', 'the other']}]},
                ]
            });
        });
    };

    return self;
});
