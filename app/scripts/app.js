'use strict';

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
      .when('/listening/new', {
        templateUrl: 'views/listenings/new.html',
        controller: 'NewListeningCtrl'
      })
      .when('/listening/record/:location/:set', {
        templateUrl: 'views/listenings/record.html',
        controller: 'RecordListeningCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
