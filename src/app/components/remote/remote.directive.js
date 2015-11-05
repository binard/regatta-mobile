(function() {
  'use strict';

  /** @ngInject */
  function remote() {

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
        scope.onLeftButton = function() {
          scope.onLeft();
        },
        scope.onRightButton = function() {
          scope.onRight();
        },
        scope.onTopButton = function() {
          scope.onTop();
        },
        scope.onBottomButton = function() {
          scope.onBottom();
        },
        scope.onRotateLeftButton = function() {
          scope.onRotateLeft();
        },
        scope.onRotateRightButton = function() {
          scope.onRotateRight();
        },
        scope.onZoomInButton = function() {
          scope.onZoomIn();
        },
        scope.onZoomOutButton = function() {
          scope.onZoomOut();
        },
        scope.onReseteButton = function() {
          scope.onResete();
        },
        scope.onValidButton = function() {
          scope.onValid();
        },
        scope.closeRemote = function() {
          scope.isVisible = false;
        },
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
