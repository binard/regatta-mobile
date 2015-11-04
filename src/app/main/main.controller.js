'use strict';

angular.module('regattaMobile')
  .controller('MainCtrl', ['CONFIG', function (CONFIG) {
    this.socketIoUrl = function() {
      return CONFIG.serverUrl + '/socket.io/socket.io.js';
    }
  }]);
