angular.module('listeningsApp').service('questionSets', function(pouchDB, $q) {
    'use strict';
    var db = pouchDB('questions');
    var self = {};
    var current = {};
    var sets = [];

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
        current.lastUpdated = new Date().getMilliseconds();
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
                resolve(sets);
                return;
            }

            db.get('sets').then(function(res) {
                if (res.sets) {
                    current = res;
                    sets = res.sets;
                    if (fn && typeof(fn) === 'function') {
                        fn(res.sets);
                    }
                    resolve(sets);
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
        details.taggable = details.taggable || [];

        return getList(function() {
            updateList(details);
        });
    };


    return self;
});
