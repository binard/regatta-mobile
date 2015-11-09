(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .directive('ngCardPreview', ngCardPreviewDirective);

  ngCardPreviewDirective.$inject = [ 'socket' ];

  function ngCardPreviewDirective(socket) {
    return {
      restrict: 'E',
      replace : true,
      scope: {
        ngCards: '=',
        ngGetImageFunction: '=',
        ngCurrentCard: '='
      },
      templateUrl: 'app/components/cardpreview/cardpreview.directive.html',
      link: function(scope) {

      }
    };
  }
})();
