/* In the api this is a questionnaire? */
angular.module('listeningsApp').service('questionSets', function(syncedModel) {
    'use strict';
    var transformForServer = function(details) {
        return details;
    };
    var transformForLocal = function(details) {
        details.last_updated = details.updated_at;
        delete details.updated_at;
        delete details.created_at;
        return details;
    };

    var model = syncedModel.create('questionnaires', '/api/questionnaires/', 'questionnaires', transformForServer, transformForLocal);
    var self = {};

    function tranformTaggables(fromView) {
        return (fromView || []).map(function(taggable) {
            if (typeof(taggable) === 'string') {
                return {name: taggable, existing: []};
            } else {
                return {
                    name: taggable.name,
                    existing: (taggable.existing || [])
                };
            }
        });
    };

    /**
     * Handles either update or create.
     * @param  {object} details [description]
     */
    function store (details) {
        details.questions = details.questions || [];
        details.taggable = tranformTaggables(details.taggable);

        return model.store(details);
    };

    /**
     * @deprecated Use getAll instead
     */
    self.listSets = model.getAll;
    /**
     * @deprecated Use get instead
     */
    self.getQuestions = model.get;
    /**
     * @deprecated Use store instead
     */
    self.create = store;
    /**
     * @deprecated Use store instead
     */
    self.update = store;

    self.store = store;
    self.get = model.get;
    self.forceSync = model.forceSync;
    self.getAll = model.getAll;

    return self;
});
