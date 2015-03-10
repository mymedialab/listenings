'use strict';

/**
 * @ngdoc service
 * @name listeningsApp.Session
 * @description
 * # Session
 * Service in the listeningsApp.
 */
angular.module('listeningsApp').service('Session', function () {
      this.create = function (sessionId, user) {
        this.id = sessionId;
        this.user = user;
      };
      this.destroy = function () {
        this.id = null;
        this.user = null;
      };
      return this;
});
