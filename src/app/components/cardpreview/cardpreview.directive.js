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
        ngGetCardImg: '=',
        ngGameId: '=',
        ngPlayerName: '=',
        ngRemovedCards: '=',
        ngHavePlayed: '='
      },
      templateUrl: 'app/components/cardpreview/cardpreview.directive.html',
      link: function(scope) {
        scope.ngCards = [];
        scope.ngRemovedCards = 0;
        scope.ngPlay = ngPlayFunction;
        scope.ngPushCard = ngPushCardFunction;
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
          console.log(scope.ngCards);
          var card = getFirstCard();

          if (!card) {
            return;
          }

          if (hasOption(card.card, 'cloud')) {
            var secondCloud = getCardAt(1);

            socket.emit(
              'movecloud',
              {
                gameId: scope.ngGameId,
                playerName: scope.ngPlayerName,
                cardIndex: card.index,
                cardPossibilities: [card.possibility, secondCloud.possibility]
              },
              function(data) {
                console.log('movecloud', data);
                if (data.status == 'ok') {
                  scope.ngCards.splice(0, 2);
                  scope.ngRemovedCards++;

                  scope.ngHavePlayed(card.index);
                  reevaluate(card.index);
                }
              }
            );
          } else if (hasOption(card.card, 'steering-wheel')){
            console.log(scope.ngCards);
            socket.emit(
              'movesteeringwheel',
              {
                gameId: scope.ngGameId,
                playerName: scope.ngPlayerName,
                cardIndex: card.index,
                cardPossibility: card.possibility
              },
              function(data) {
                console.log('movesteeringwheel', data);
                if (data.status == 'ok') {
                  console.log(scope.ngCards);
                  scope.ngCards.splice(0, 1);
                  scope.ngRemovedCards++;
                  console.log(scope.ngCards);

                  scope.ngHavePlayed(card.index);
                  reevaluate(card.index);

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
                console.log('move', data);
                if (data.status == 'ok') {
                  scope.ngCards.splice(0, 1);
                  scope.ngRemovedCards++;

                  scope.ngHavePlayed(card.index);
                  reevaluate(card.index);
                }
              }
            );
          }
        }

        function reevaluate(indexPlayed) {
          for (var i in scope.ngCards) {
            if (scope.ngCards[i].index >= indexPlayed) {
              scope.ngCards[i].index--;
            }
          }
        }
      }
    };
  }
})();
