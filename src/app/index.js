'use strict';

var app = angular.module('regattaMobile', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'btford.socket-io'])
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
      .otherwise({
        redirectTo: '/'
      });
  });

app.factory('socket', function (socketFactory) {
  var myIoSocket = io.connect('http://localhost:8080');

  var socket = socketFactory({
    ioSocket: myIoSocket
  });

  return socket;
});