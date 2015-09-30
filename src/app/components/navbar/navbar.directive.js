(function() {
  'use strict';



  /** @ngInject */
  function actionNavbar() {

    /** @ngInject */
    function ActionNavbarController() {
    }
    
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
      },
      controller: ActionNavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;
  }

    angular
    .module('regattaMobile')
    .directive('actionNavbar', actionNavbar);

})();