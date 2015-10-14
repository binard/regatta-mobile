(function() {
  'use strict';

    angular
    .module('regattaMobile')
    .directive('placeboatremote', placeBoatRemote);

  /** @ngInject */
  function placeBoatRemote(socket) {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/placeboatremote/placeboatremote.html',
      scope: {
        isVisible : "=",
        isBegun : "=",
        player: "=",
        gameId : "="
      },
      link : function(scope, $element, attrs){
        scope.moveLeft = function() {
          placeOnStart(-1, 0, 0);
        };
        scope.moveRight = function() {
          placeOnStart(1, 0, 0);
        };
        scope.moveTop = function() {
          placeOnStart(0, -1, 0);
        };
        scope.moveBottom = function() {
          placeOnStart(0, 1, 0);
        };
        scope.rotateLeft = function() {
          placeOnStart(0, 0, -90);
        };
        scope.rotateRight = function() {
          placeOnStart(0, 0, 90);
        };
        scope.validPosition = function() {
          confirmPlaceOnStart();
        };

        function placeOnStart(deltaX, deltaY, deltaRotation){
          socket.emit(
            'placeonstart',
            {
              'playerName': scope.player.playerName,
              'gameId': scope.gameId,
              'position': {
                'deltaX': deltaX,
                'deltaY': deltaY,
                'deltaRotation': deltaRotation
              }
            },
            function(data) {
              console.log('placeonstart', data);
            }
          );
        }

        function confirmPlaceOnStart(){
          socket.emit(
            'confirmplaceonstart',
            {
              'playerName': scope.player.playerName,
              'gameId': scope.gameId,
            },
            function(response) {
              console.log(response);
              if(response.status == "ok"){
                scope.isVisible = false;
                scope.isBegun = true;
              }
            }
          );
        }
      }
    };
    return directive;
  }

})();
