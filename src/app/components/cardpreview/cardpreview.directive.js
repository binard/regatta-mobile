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
        ngPushCard: '=',
        ngPlay: '=',
        ngGetCardImg: '=',
        ngGameId: '=',
        ngPlayerName: '=',
        ngRemovedCards: '=',
      },
      templateUrl: '/app/components/cardpreview/cardpreview.directive.html',
      link: function(scope) {
        scope.ngCards = [];
        scope.ngRemovedCards = 0;
        scope.ngPushCard = ngPushCardFunction;
        scope.ngPlay = ngPlayFunction;
        scope.pop = popFunction;

        function ngPushCardFunction(data) {
          console.log('add card preview', data);

          if (data.card.type != 'move') {
            return;
          }

          var lastCard = getLastCard();
          if (!lastCard) {
            scope.ngCards.push(data);
            pushPreview();
            return;
          }

          if (hasOption(lastCard.card, 'cloud') && lastCard.index == data.index) {
            scope.ngCards.push(data);
            pushPreview();
            return;
          }

          if (hasOption(lastCard.card, 'steering-wheel')
            && scope.ngCards.length == 1
            && getLastCard().index != data.index) {
            scope.ngCards.push(data);
            pushPreview();
            return;
          }
        }

        function ngPlayFunction() {
          if (scope.ngCards.length > 0) {
            playRecursively();

            scope.ngCards = [];
          } else {
            alert('L\'option nuage doit être jouée');
          }
        }

        function popFunction() {
          scope.ngCards.pop();
          popPreview();
        }

        function getLastCard() {
          if (!scope.ngCards.length) {
            return;
          }

          return scope.ngCards[scope.ngCards.length - 1];
        }

        function getFirstCard() {
          if (!scope.ngCards.length) {
            return;
          }

          return scope.ngCards[0];
        }

        function getCardAt(index) {
          if (index >= scope.ngCards.length) {
            return null;
          }
          return scope.ngCards[index];
        }

        function hasOption(card, option) {
          if (!card.options) {
            return false;
          }

          return card.options.indexOf(option) != -1;
        }

        function pushPreview() {
          console.log(scope.ngGameId, scope.ngPlayerName);

          socket.emit('viewcard', {
            gameId: scope.ngGameId,
            playerName: scope.ngPlayerName,
            cardIndex: getLastCard().index,
            cardPossibility: getLastCard().possibility
          }, function(data) {
            console.log('viewcard callback', data);
          });
        }

        function popPreview() {
          socket.emit('popviewcard', {
            gameId: scope.ngGameId,
            playerName: scope.ngPlayerName
          });
        }

        function playRecursively() {
          var card = getFirstCard();

          if (!card) {
            return;
          }

          if (hasOption(card.card, 'cloud')) {
            var secondCloud = getCardAt(1);

            socket.emit(
              'movecloud', {
                gameId: scope.ngGameId,
                playerName: scope.ngPlayerName,
                cardIndex: card.index,
                cardPossibilities: [card.possibility, secondCloud.possibility]
              },
              function(data) {
                if (data.status == 'ok') {
                  scope.ngCards.splice(0, 2);
                  scope.ngRemovedCards+=2;
                }
              }
            );
          } else if (hasOption(card.card, 'steering-wheel')){
            socket.emit(
              'movesteeringwheel',
              {
                gameId: scope.ngGameId,
                playerName: scope.ngPlayerName,
                cardIndex: card.index,
                cardPossibility: card.possibility
              },
              function(data) {
                if (data.status == 'ok') {
                  scope.ngRemovedCards++;
                  playRecursively();
                }
              }
            );
          } else {
            socket.emit(
              'move',
              {
                gameId: scope.ngGameId,
                playerName: scope.ngPlayerName,
                cardIndex: card.index,
                cardPossibility: card.possibility
              },
              function(data) {
                if (data.status == 'ok') {
                  scope.ngRemovedCards++;
                }
              }
            );
          }
        }
      }
    };
  }
})();
