'use strict';

/**
 * @ngdoc service
 * @name listeningsApp.UserService
 * @description
 * # UserService
 * Factory in the listeningsApp.
 */
angular.module('listeningsApp').factory('UserService', function ($http, ngToast) {
    var self = {};

    self.addNew = function(credentials) {
      return $http.post('/api/user', credentials).then(function() {
          ngToast.create({content:'New user added.', className: 'success'});
      }, function() {
          ngToast.create({content:'Failed to add new user.', className: 'danger'});
      });
    };

    self.update = function(details) {
        return $http.put('/api/user/update', details).then(function() {
            ngToast.create({content:'User details updated.', className: 'success'});
        }, function() {
            ngToast.create({content:'update failed.', className: 'success'});
        });
    };

    return self;
  }
);
