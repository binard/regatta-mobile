'use strict';

angular.module('regattaMobile', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'ui.bootstrap', 'btford.socket-io'])
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
  }).factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('ws://localhost:4512/');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket;    
  });