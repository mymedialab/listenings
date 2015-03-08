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
    'pouchdb'
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
      .otherwise({
        redirectTo: '/'
      });
  });
