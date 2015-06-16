'use strict';

angular.module('regattaMobile', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/join', {
        templateUrl: 'app/join/join.html',
        controller: 'JoinCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
