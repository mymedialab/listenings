'use strict';

/*global $:true */

/**
 * @ngdoc overview
 * @name listeningsApp
 * @description
 * # listeningsApp
 *
 * Main module of the application.
 */
angular
  .module('listeningsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'pouchdb',
    'ngTagsInput',
    'angular-loading-bar',
    'ngToast'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/listening/list', {
        templateUrl: 'views/listenings/list.html',
        controller: 'ListListeningCtrl'
      })
      .when('/listening/new', {
        templateUrl: 'views/listenings/new.html',
        controller: 'NewListeningCtrl'
      })
      .when('/listening/show/:listening_id', {
        templateUrl: 'views/listenings/show.html',
        controller: 'ShowListeningCtrl'
      })
      .when('/listening/record/:location/:set/:houseno', {
        templateUrl: 'views/listenings/record.html',
        controller: 'RecordListeningCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/adduser', {
        templateUrl: 'views/add-user.html',
        controller: 'AddUserCtrl'
      })
      .when('/listening/create', {
        templateUrl: 'views/listenings/create.html',
        controller: 'CreateListeningCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).config(function($provide) {
    /**
     * delegate logging to our api endpoint, this is to make debugging clientside issues easier
     */
    var postError = function(message) {
      $.ajax({
        method: 'POST',
        url: '/api/log',
        data: {message: message}
      });

      console.log(message);
    };

    $provide.decorator('$log', function($delegate) {
      $delegate.log = postError;
      $delegate.info = postError;
      $delegate.warn = postError;
      $delegate.error = postError;
      $delegate.debug = postError;

      return $delegate;
    });
  });
