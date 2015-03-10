angular.module('listeningsApp').service('questionSets', function(pouchDB, $q) {
    'use strict';
    var db = pouchDB('questions');
    var self = {};
    var current = {};
    var sets = [];

    var reset = function() {
         db.get('sets').then(function(res) {
            db.put({
                _id: 'sets',
                lastUpdated: new Date().getMilliseconds(),
                _rev: res._rev,
                sets: [
                    {name: 'Likes and concerns', questions: ['What like?', 'Were you hugged enough as a child?', 'OO R YA?'], taggable: [{name: 'likes', existing:['this', 'that', 'the other']}]},
                    {name: 'Some other question set!', questions: ['Why am I here?', 'What do I want from this?', 'Who even asked you anyway?'], taggable: [{name: 'likes', existing:['this', 'that', 'the other']}]},
                ]
            });
        });
    };

    var findQuestionsByName = function(name) {
         var found = sets.filter(function(input) {
            return input.name === name;
        });
        return found.length ? found[0] : false;
    };

    /**
     * Only call once results are loaded.
     */
    var updateList = function(newItem) {
        current.sets.push(newItem);
        db.put(current);
    };

    /**
     *
     * @param  {Function} fn Function to execute on success
     * @return promise
     */
    var getList = function(fn) {

        return $q(function(resolve, reject) {

             if (sets.length) {
                if (fn && typeof(fn) === 'function') {
                    fn(sets);
                }
                resolve();
                return;
            }

            db.get('sets').then(function(res) {
                if (res.sets) {
                    current = res;
                    sets = res.sets;
                    if (fn && typeof(fn) === 'function') {
                        fn(res.sets);
                    }
                    resolve(res);
                } else {
                    reject(res);
                }
            }).catch(reject);
        });
    };

    // @todo attempt to pull down from server and over-write current.

    self.listSets = function() {
        return getList();
    };

    self.getQuestions = function (setName) {

        return $q(function(resolve, reject) {
            if (sets.length) {
                resolve(findQuestionsByName(setName));
                return;
            }
            db.get('sets').then(function(res) {
                if (res.sets) {
                    current = res;
                    sets = res.sets;
                    resolve(findQuestionsByName(setName));
                } else {
                    reject(res);
                }
            }).catch(reject);
        });
    };

    self.create = function (details) {
        details.questions = details.questions || [];
        details.taggables = details.taggables || [];

        return getList(function() {
            updateList(details);
        });
    };


    return self;
});
