(function() {
  'use strict';

  remote.$inject = ['$interval'];

  /** @ngInject */
  function remote($interval) {
    const touchActionInterval = 60;
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/remote/remote.html',
      scope: {
        isVisible : "=",
        onLeft : "&",
        onRight : "&",
        onTop : "&",
        onBottom : "&",
        onRotateLeft : "&",
        onRotateRight : "&",
        onZoomIn : "&",
        onZoomOut : "&",
        onResete : "&",
        onValid : "&",
      },
      link : function(scope, $element, attrs){
        var timer;
        scope.onStop = function() {
          console.log('unpress');
          $interval.cancel(timer);
        };
        scope.onLeftButton = function() {
          console.log('press left');
          scope.onLeft();
          timer = $interval(function() {
            scope.onLeft();
          }, touchActionInterval);
        };
        scope.onRightButton = function() {
          console.log('press right');
          scope.onRight();
          timer = $interval(function() {
            scope.onRight();
          }, touchActionInterval);
        };
        scope.onTopButton = function() {
          console.log('press top');
          scope.onTop();
          timer = $interval(function() {
            scope.onTop();
          }, touchActionInterval);
        };
        scope.onBottomButton = function() {
          console.log('press bottom');
          scope.onBottom();
          timer = $interval(function() {
            scope.onBottom();
          }, touchActionInterval);
        };
        scope.onRotateLeftButton = function() {
          scope.onRotateLeft();
        };
        scope.onRotateRightButton = function() {
          scope.onRotateRight();
        };
        scope.onZoomInButton = function() {
          console.log('press zoom in');
          scope.onZoomIn();
          timer = $interval(function() {
            scope.onZoomIn();
          }, touchActionInterval);
        };
        scope.onZoomOutButton = function() {
          console.log('press zoom out');
          scope.onZoomOut();
          timer = $interval(function() {
            scope.onZoomOut();
          }, touchActionInterval);
        };
        scope.onReseteButton = function() {
          scope.onResete();
        };
        scope.onValidButton = function() {
          scope.onValid();
        };
        scope.closeRemote = function() {
          scope.isVisible = false;
        };
        scope.isButtonVisible = function(action){
          return $element.attr(action) != null;
        }
      }
    };

    return directive;
  }

    angular
    .module('regattaMobile')
    .directive('remote', remote);

})();
