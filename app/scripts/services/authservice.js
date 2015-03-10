'use strict';

/**
 * @ngdoc service
 * @name listeningsApp.AuthService
 * @description
 * # AuthService
 * Factory in the listeningsApp.
 */
angular.module('listeningsApp').factory('AuthService', function ($http, $q, Session, ngToast) {
    var authService = {};
    var loaded = false;
    var loading = false;

    authService.login = function(credentials) {
      return $http
        .post('/api/login', credentials)
        .error(function () {
          ngToast.create({content:'Login failed. Please try again.', className: 'danger'});
        })
        .success(function(res){
          Session.create(res.user.id, res.user);
          ngToast.create({content:'Login success.', className: 'success'});
        });
    };

    authService.changePassword = function(currentPassword, newPassword) {
      var payload = {
        'existing_password': currentPassword,
        'new_password': newPassword
      };
      return $http
        .post('/api/user/changepassword', payload)
        .error(function () {
          ngToast.create({content:'Failed to change password. Please try again.', className: 'danger'});
        })
        .success(function(res){
          Session.create(res.user.id, res.user);
          ngToast.create({content:'Password changed.', className: 'success'});
        });
    };

    authService.logout = function() {
      return $http.post('/api/logout')
        .success(function() {
          Session.destroy();
            ngToast.create({content:'You have been logged out.', className: 'success'});

        })
        .error(function() {
          ngToast.create({content:'Logout failed. Please try again.', className: 'danger'});

        });
    };

    authService.isAuthenticated = function() {
      return !!Session.userId;
    };

    authService.findOpenSession = function() {
      if (loaded) {
        return $q(function(resolve) {
          resolve();
        });
      } else if (!loading) {
       loading = $q(function(resolve) {
          $http.get('/api/session').success(function(res) {
            if (res.user) {
              Session.create(res.user.id, res.user);
              loaded = true;
            }
            resolve();
          }).error(function() {
            resolve(); // always resolve. Actual state is found by querying the service again after load,.
          });
        });
      }

      return loading;

    };

    /**
     * Use this if an action (such as registering with facebook) has opened a server-side session
     * and returned a user. If a session is opened but a user is NOT returned, you can use findOpenSession();
     */
    authService.sessionOpened = function(user) {
        Session.create(user.id, user);
    };

    authService.updateSession = function(user) {
        Session.create(user.id, user);
    };

    return authService;
});
