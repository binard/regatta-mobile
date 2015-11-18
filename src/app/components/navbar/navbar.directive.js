(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .directive('actionnavbar', actionNavbar);

  function actionNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        flagIsVisible: '=',
        clearIsVisible: '=',
        trapIsVisible: '=',
        trashIsVisible: '=',
        playIsVisible: '=',
        onStart: '&',
        onMoveMap: '&',
        onTackBabord: '&',
        onTackTribord: '&',
        onTrash: '&',
        onPlay: '&',
        onTrap: '&',
        onClearPreview: '&',
        mode: '='
      },
      link : function(scope) {
        var currentAction = scope.onPlay;

        scope.$watch('mode', function(newValue) {
          console.log(newValue);
          if (newValue == 'play') {
            scope.onPlayAction();
          } else if (newValue == 'trash') {
            scope.onTrashAction();
          } else if (newValue == 'trap') {
            scope.onTrapAction();
          }
        });

        scope.tackTemplateUrl = "popoverTackTemplate.html";
        scope.modePlayTemplateUrl = "modePlayTemplate.url";
        scope.onFlagAction = function(){
          scope.onStart();
        };
        scope.onMoveCrossAction = function(){
          scope.onMoveMap();
        };
        scope.onTackBabordAction = function(){
          scope.onTackBabord();
        };
        scope.onTackTribordAction = function(){
          scope.onTackTribord();
        };
        scope.onTrashAction = function(){
          if (scope.trashIsVisible) {
            scope.mode = 'trash';
            currentAction = scope.onTrash;
          }
        };
        scope.onPlayAction = function(){
          if (scope.playIsVisible) {
            scope.mode = 'play';
            currentAction = scope.onPlay;
          }
        };
        scope.onTrapAction = function() {
          if (scope.trapIsVisible) {
            scope.mode = 'trap';
            currentAction = scope.onTrap;
          }
        };
        scope.onTerminateAction = function() {
          currentAction();
        }
      }
    };
    return directive;
  }
})();
