angular.module('listeningsApp').service('questionSets', function(pouchDB) {
    'use strict';
    var db = pouchDB('questions');
    var self = {};

    // @todo Pull down from server and attempt to over-write current.

    self.listSets = function(details) {
        return db.get('sets');
    };

    self.getQuestions = function (set) {
        // @todo
    };

    self.reset = function() {
        db.put({
            _id: 'sets',
            lastUpdated: new Date().getMilliseconds(),
            sets: [
                {'name': 'Likes and concerns', questions: []},
                {'name': 'Some other question set!', questions: []},
            ]
        });
    };

    return self;
});
