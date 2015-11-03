'use strict';

var app = angular.module('regattaMobile', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'btford.socket-io', 'toaster'])
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
      .when('/playeroptions/:id', {
        templateUrl: 'app/playeroptions/playeroptions.html',
        controller : 'PlayerOptionsCtrl'
      })
      .when('/playersvalidation/:id', {
        templateUrl : 'app/playersvalidation/playersvalidation.html',
        controller : 'PlayersValidationCtrl'
      })
      .when('/board/:id', {
        templateUrl : 'app/board/board.html'
      })
      .when('/start/:id', {
        templateUrl: 'app/start/start.html',
        controller: 'StartCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('socket', function (socketFactory) {
  var myIoSocket = io.connect('http://192.168.1.61');

  var socket = socketFactory({
    ioSocket: myIoSocket
  });

  return socket;
});
