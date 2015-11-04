(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .constant('CONFIG', {
      serverUrl : 'http://localhost:8041',
      socketIoUrl : 'http://localhost:8041/socket.io/socket.io.js'
    });
})();
