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
      .when('/users', {
        templateUrl: 'views/users/manage.html',
        controller: 'UserCtrl'
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
      .when('/areas', {
        templateUrl: 'views/areas/manage.html',
        controller: 'AreaCtrl'
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
  });
