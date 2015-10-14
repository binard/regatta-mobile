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
        onMoveMap : '&'
      },
      link : function(scope){
        scope.onFlagAction = function(){
          scope.onStart();
        },
        scope.onMoveCrossAction = function(){
          scope.onMoveMap();
        }
      }
    };

    return directive;

  }

    angular
    .module('regattaMobile')
    .directive('actionnavbar', actionNavbar);

})();
