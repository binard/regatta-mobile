(function() {
  'use strict';



  /** @ngInject */
  function actionNavbar() {
    
    var directive = {
      restrict: 'EA',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
        onstart : "&"
      },
      link : function(scope){
        scope.onFlagAction = function(){
          scope.onstart();
        }
      }
    };

    return directive;
  }

    angular
    .module('regattaMobile')
    .directive('actionNavbar', actionNavbar);

})();