'use strict';

/**
 * @ngdoc service
 * @name listeningsApp.Session
 * @description
 * # Session
 * Service in the listeningsApp.
 */
angular.module('listeningsApp').service('Session', function ($location) {
      this.create = function (sessionId, user) {
        this.id = sessionId;
        this.user = user;
      };
      this.destroy = function () {
        this.id = null;
        this.user = null;

        // redirect to the root (aka login screen) after session destroy
        $location.path('/');
      };
      return this;
});
