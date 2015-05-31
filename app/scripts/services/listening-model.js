/**
 * an Interview document uses the user id and the recordedAt timestamp for the document ID.
 *
 * This should be sufficient to make interviews unique
 * a double-bounce save for instance will resolve to the same document
 */
angular.module('listeningsApp').service('listeningModel', function(syncedModel, Session) {
    'use strict';
    var transformForServer = function(localRow) {
        localRow.area = localRow.area || '';
        if (typeof(localRow.questionSet) === 'object') {
            localRow.questionSet = localRow.questionSet.name;
        }
        return localRow;
    };
    var transformForLocal = function(remoteRow) {
        var localRow = {
            id:           remoteRow.id,
            type:         remoteRow.type,
            location:     remoteRow.location,
            houseno:      remoteRow.houseno,
            questions:    remoteRow.responses,
            questionSet:  remoteRow.questionnaire && remoteRow.questionnaire.name || 'unknown',
            recordedAt:   new Date(remoteRow.date),
            last_updated: remoteRow.updated_at, // jshint ignore:line
            userId:       remoteRow.interviewer_id // jshint ignore:line
        };

        return localRow;
    };

    var model = syncedModel.create('interviews', '/api/interviews/', 'interviews', transformForServer, transformForLocal);
    var self = {};

    self.storeListening = function(details) {
        var date = new Date();
        var time = date.getTime(); //milliseconds
        var now  = Math.floor(time / 1000);

        details.recordedAt = now;
        details.userId     = Session.user.id;

        if (typeof(details.questionSet) === 'object') {
            details.questionSet = details.questionSet.name;
        }

        return model.store(details);
    };

    /**
     * @deprecated use getAll instead
     */
    self.getAllListenings = function () {
        return model.getAall();
    };
    self.getAll = function () {
        return model.getAall();
    };

    /**
     * @deprecated use get instead
     */
    self.find = function(id) {
        return model.get(id);
    };
    self.get = function(id) {
        return model.get(id);
    };

    /**
     * work out what needs syncing and make it so
     */
    self.sync = function() {
        return model.forceSync().then(model.getAll);
    };

    return self;
});
