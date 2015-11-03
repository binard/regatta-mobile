(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .directive('ngCardPreview', ngCardPreviewDirective);

  function ngCardPreviewDirective() {
    return {
      restrict: 'E',
      scope: {
        ngPushCard: '=',
        ngGetCardImg: '='
      },
      templateUrl: '/app/components/cardpreview/cardpreview.directive.html',
      link: function(scope, element, attrs) {
        scope.ngCards = [];
        scope.ngPushCard = ngPushCardFunction;
        scope.clear = clearFuncion;

        function ngPushCardFunction(data) {
          console.log('add card preview', data);

          if (data.card.type != 'move') {
            return;
          }

          var lastCard = getLastCard();
          if (!lastCard) {
            scope.ngCards.push(data);
            return;
          }

          if (hasOption(lastCard.card, 'cloud') && lastCard.index == data.index) {
            scope.ngCards.push(data);
            return;
          }

          if (hasOption(lastCard.card, 'steering-wheel') && scope.ngCards.length == 1) {
            scope.ngCards.push(data);
            return;
          }
        }

        function clearFunction() {
          scope.cards = [];
        }

        function getLastCard() {
          return scope.cards[scope.cards.length - 1];
        }

        function hasOption(card, option) {
          return card.options.indexOf(option) != -1;
        }
      }
    };
  }
})();
