'use strict';

angular.module('regattaMobile')
  .controller('MainCtrl', ['CONFIG', '$sce', function (CONFIG, $sce) {
    this.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };
    this.socketIoUrl = function() {
      return CONFIG.serverUrl + '/socket.io/socket.io.js';
    }
  }]);
