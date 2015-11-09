(function() {
  'use strict';

    angular
    .module('regattaMobile')
    .directive('movemapremote', moveMapRemote);

  /** @ngInject */
  function moveMapRemote(socket) {

    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/movemapremote/movemapremote.html',
      scope: {
        player : "=",
        gameId : "=",
        isVisible : "="
      },
      link : function(scope, $element, attrs){
        scope.moveLeft = function() {
          console.log('moveLeft');
          movingView(0, 0, 0, 10);
        };
        scope.moveRight = function() {
          console.log('moveRight');
          movingView(0, 0, 10, 0);
        };
        scope.moveTop = function() {
          console.log('moveTop');
          movingView(0, 10, 0, 0);
        };
        scope.moveBottom = function() {
          console.log('moveBottom');
          movingView(10, 0, 0, 0);
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
          console.log('movingView : ' + top + ":" + bottom + ":" + left + ":" + right + " //GameId : " + scope.gameId);
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
