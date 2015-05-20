'use strict';

/*global $:true, navigator:true, document:true */

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
      .when('/listening/record', {
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
      .when('/questionnaire/create', {
        templateUrl: 'views/questionnaires/create.html',
        controller: 'CreateQuestionnaireCtrl'
      })
      .when('/questionnaire/list', {
        templateUrl: 'views/questionnaires/list.html',
        controller: 'ListQuestionnairesCtrl'
      })
      .when('/questionnaire/show/:questionnaire_id', {
        templateUrl: 'views/questionnaires/show.html',
        controller: 'ShowQuestionnaireCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).config(function(pouchDBProvider, POUCHDB_METHODS) {
      // add pouchdb upsert plugin
      var upsertMethods = {
          upsert: 'qify',
          putIfNotExists: 'qify'
      };
      pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, upsertMethods);
  }).config(function($provide) {
    /**
     * delegate logging to our api endpoint, this is to make debugging clientside issues easier
     */
    var postError = function postError(message) {
      $.ajax({
        method: 'POST',
        url: '/api/log',
        data: {
          message: message,
          browser: navigator.userAgent || '',
          viewport: {
            w: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
            h: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
          },
          full: arguments
        }
      });

      console.log(message);
    };

    $provide.decorator('$log', function($delegate) {
      // variadic your variadic.
      var error = function error() {
        postError.apply(this, arguments);
      };

      $delegate.log   = error;
      $delegate.info  = error;
      $delegate.warn  = error;
      $delegate.error = error;
      $delegate.debug = error;

      return $delegate;
    });
  });
