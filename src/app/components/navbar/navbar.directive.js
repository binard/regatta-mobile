(function() {
  'use strict';



  /** @ngInject */
  function actionNavbar() {

    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        flagIsVisible : '=',
        onStart : '&',
        onMoveMap : '&',
        onTackBabord : '&',
        onTackTribord : '&',
        onTrash : '&',
        onPlay : '&'
      },
      link : function(scope){
        scope.tackTemplateUrl = "popoverTackTemplate.html";
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
          scope.onTrash();
        };
        scope.onPlayAction = function(){
          scope.onPlay();
        };
      }
    };
    return directive;
  }

    angular
    .module('regattaMobile')
    .directive('actionnavbar', actionNavbar);

})();
