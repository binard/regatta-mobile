(function() {
  'use strict';

    angular
    .module('regattaMobile')
    .directive('movemapremote', moveMapRemote);

  /** @ngInject */
  function moveMapRemote(socket) {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/movemapremote/movemapremote.html',
      scope: {
        player : "=",
        gameId : "=",
        isVisible : "="
      },
      link : function(scope, $element, attrs){
        scope.moveLeft = function() {
          movingView(0, 0, 10, 0);
        };
        scope.moveRight = function() {
          movingView(0, 0, 0, 10);
        };
        scope.moveTop = function() {
          movingView(10, 0, 0, 0);
        };
        scope.moveBottom = function() {
          movingView(0, 10, 0, 0);
        };
        scope.reset = function() {
          reinitZoomAndMove();
        };
        scope.zoomIn = function() {
          zoomMap(0, 10);
        };
        scope.zoomOut = function() {
          zoomMap(10, 0);
        };
        function movingView(top, bottom, left, right) {
          socket.emit(
            'movingview',
            {
              'gameId': scope.gameId,
              'top': top,
              'bottom': bottom,
              'left': left,
              'right': right
            }
          );
        }
        function zoomMap(zoomMinus, zoomPlus){
          socket.emit(
              'movingview',
              {
                'gameId': scope.gameId,
                'zoomMinus': zoomMinus,
                'zoomPlus': zoomPlus
              }
            );
        }
        function reinitZoomAndMove(){
          socket.emit(
            'movingview',
            {
              'gameId': scope.gameId,
              'zoomInit': true,
              'moveInit': true
            }
          );
        }
      }
    };

    return directive;
  }

})();
