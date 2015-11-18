(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .controller('BoardCtrl', boardCtrlFunction);

  boardCtrlFunction.$inject = ['CONFIG', '$routeParams', '$sce', 'socket', 'toaster'];

  function boardCtrlFunction (CONFIG, $routeParams, $sce, socket, toaster) {
    this.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    var me = this;
    me.gameId = $routeParams.id;
    me.My = {
      cards: []
    };
    me.players = [];
    //me.My = {"playerName":"Thomas","boat":{"color":"#26A65B","number":"51","position":{"x":13,"y":31},"width":1,"length":5,"orientation":90},"started":true,"checkLines":[{"pointA":{"x":12,"y":30},"pointB":{"x":24,"y":30}},{"pointA":{"x":6,"y":7},"pointB":{"x":-200,"y":7}},{"pointA":{"x":6,"y":7},"pointB":{"x":6,"y":-200}},{"pointA":{"x":18,"y":18},"pointB":{"x":18,"y":200}},{"pointA":{"x":18,"y":18},"pointB":{"x":200,"y":18}},{"pointA":{"x":30,"y":7},"pointB":{"x":200,"y":7}},{"pointA":{"x":30,"y":7},"pointB":{"x":30,"y":200}},{"pointA":{"x":12,"y":30},"pointB":{"x":24,"y":30}}],"trappedTime":0,"cards":[{"name":"Triple babord","width":5,"height":7,"svgParams":{"card-trois-gauche":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":3},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"2"},{"moves":[{"x":0,"y":5},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"4"},{"moves":[{"x":0,"y":7},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"}],"options":[],"type":"move","$$hashKey":"object:52"},{"name":"Tout droit nuage","width":5,"height":7,"svgParams":{"card-tout-droit":"display: block;","card-option-nuage":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"}],"options":["cloud"],"type":"move","$$hashKey":"object:53"},{"name":"Tout droit","width":5,"height":7,"svgParams":{"card-tout-droit":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"}],"options":[],"type":"move","$$hashKey":"object:54"},{"name":"Triple babord","width":5,"height":7,"svgParams":{"card-trois-gauche":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":3},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"2"},{"moves":[{"x":0,"y":5},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"4"},{"moves":[{"x":0,"y":7},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"}],"options":[],"type":"move","$$hashKey":"object:55"},{"name":"Joker 1","width":5,"height":7,"svgParams":{"card-joker":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":1},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"0"},{"moves":[{"x":0,"y":4},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"3"},{"moves":[{"x":0,"y":6},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"},{"moves":[{"x":0,"y":5},{"x":2,"y":0},{"x":0,"y":3}],"rotation":0,"possibilityIndex":"7"},{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"},{"moves":[{"x":0,"y":5},{"x":-2,"y":0},{"x":0,"y":3}],"rotation":0,"possibilityIndex":"11"},{"moves":[{"x":0,"y":6},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"13"},{"moves":[{"x":0,"y":4},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"15"},{"moves":[{"x":0,"y":1},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"18"}],"options":[],"type":"move","$$hashKey":"object:56"}],"gameId":"1"};
    me.mode = 'move';

    socket.emit('my', function(response){
      console.log('my', response);
      me.My = response.data.player;
      me.playerName = me.My.playerName;
      me.currentCardIndex = 0;
      me.currentCard = me.My.cards[me.currentCardIndex];
    });

    socket.emit(
      'listplayer',
      {
        gameId: me.gameId
      },
      function(response){
        console.log('listplayer', response);
        if (response.status == 'ok') {
          me.players = response.data;
        }
      }
    );

    me.startRemoteIsVisible = false;
    me.moveMapRemoteIsVisible = false;
    me.currentCardIndex = 0;
    me.currentCard = me.My.cards[me.currentCardIndex];
    me.previewNumber = 1;
    me.mode = 'play';
    me.canChangeCard = true;
    me.cardPlayed = 0;

    me.previewIsOk = false;
    me.playIsOk = false;
    me.trashIsOk = false;
    me.trapIsOk = false;
    me.playIsFinished = false;

    this.isCurrentMode = function(mode) {
      return me.mode == mode;
    };

    this.selectCardToggle = function(card) {
      card.isSelected = !card.isSelected;
    };

    this.modeIsVisible = function(mode) {
      var test = false;
      switch (mode) {
        case 'play':
          test = !me.trashIsOk && !me.trapIsOk && !me.playIsFinished;
          break;

        case 'trash':
          test = !me.playIsOk && !me.previewIsOk && !me.trapIsOk && !me.playIsFinished;
          break;

        case 'trap':
          test = me.playIsFinished && !me.trashIsOk;
          break;
      }

      return test;
    };

    this.getCurrentImage = function(card){
      var paramStr = '';
      for (var paramIndex in card.svgParams) {
        paramStr += '&' + paramIndex + '=' + encodeURIComponent(card.svgParams[paramIndex]);
      }

      return CONFIG.serverUrl + '/svg?svgfile=carte' + paramStr;
    };

    this.canDisplayPossibilities = function(card) {
      if (!me.My.started) {
        return false;
      }

      if (!me.isCurrentMode('play')) {
        return false;
      }

      if (card.preview && me.currentCard.options && card.options.indexOf('cloud') == -1) {
        return false;
      }

      if (card.preview && me.currentCard.options && card.options.indexOf('cloud') != -1 && card.previewPossibilities.length == 2) {
        return false;
      }

      return true;
    };

    this.clearIsVisible = function() {
      var clearIsVisible = false;
      for (var cardIndex in me.My.cards) {
        if (me.My.cards[cardIndex].preview == true) {
          clearIsVisible = true;
          break;
        }
      }

      return clearIsVisible;
    };

    this.previewCard = function(numPossibilty){
      if(me.indexIsPossible(me.currentCard, numPossibilty) && !me.currentCard.preview) {
        me.previewIsOk = true;
        me.currentCard.preview = true;
        me.currentCard.previewNumber = parseInt(me.previewNumber);
        me.currentCard.previewPossibilities = [];
        me.currentCard.previewPossibilities.push(numPossibilty);
        me.previewNumber++;
        if (me.currentCard.options && me.currentCard.options.indexOf('cloud') != -1) {
          me.canChangeCard = false;
        }
        socket.emit('viewcard', {
          gameId: me.gameId,
          playerName: me.My.playerName,
          cardIndex: me.currentCardIndex,
          cardPossibility: numPossibilty
        });
      } else if (me.currentCard.preview) {
        if (me.currentCard.options && me.currentCard.options.indexOf('cloud') != -1 && me.currentCard.previewPossibilities.length == 1) {
          me.currentCard.previewPossibilities.push(numPossibilty);
          me.canChangeCard = true;
          socket.emit('viewcard', {
            gameId: me.gameId,
            playerName: me.My.playerName,
            cardIndex: me.currentCardIndex,
            cardPossibility: numPossibilty
          });
        }
      }
    };

    this.clearPreview = function() {
      me.previewIsOk = false;
      for (var cardIndex in me.My.cards) {
        if (me.My.cards[cardIndex].preview) {
          me.My.cards[cardIndex].preview = false;
          me.My.cards[cardIndex].previewNumber = 0;
          me.My.cards[cardIndex].previewPossibilities = [];
          me.canChangeCard = true;
        }
      }

      socket.emit('clearviewcard', {
        gameId: me.gameId,
        playerName: me.My.playerName
      });

      me.previewNumber = 1;
    };

    this.indexIsPossible = function(card, index){
      var isPossibility = false;
      for(var i=0; i < card.possibilities.length; i++){
        if(card.possibilities[i].possibilityIndex == index)
        {
          isPossibility = true;
          break;
        }
      }
      return isPossibility;
    };

    this.showNextCard = function(index) {
      if (!me.canChangeCard) {
        return;
      }
      me.currentCardIndex = ++index % me.My.cards.length;
      me.currentCard = me.My.cards[me.currentCardIndex];
    };

    this.showPreviousCard = function(index) {
      if (!me.canChangeCard) {
        return;
      }
      var currentIndex = index !== 0 ? --index : me.My.cards.length - 1;
      me.currentCard = me.My.cards[currentIndex];
    };

    this.showStartRemote = function() {
      me.startRemoteIsVisible = ! me.startRemoteIsVisible;
      me.moveMapRemoteIsVisible = false;
    };

    this.showMoveMapRemote = function() {
      me.moveMapRemoteIsVisible = ! me.moveMapRemoteIsVisible;
      me.startRemoteIsVisible = false;
    };

    this.tack = function(angle){
      socket.emit(
        'tack',
        {
          'gameId':me.gameId,
          'playerName': me.My.playerName,
          'angle': angle
        },
        function(response) {
          console.log('tack', response);
          if(response.status === 'error'){
            alert(response.data.code + ' : ' + response.data.message);
          }
        }
      )
    };

    this.dropCards = function(){
      var selectedCards = [];

      for (var cardIndex in me.My.cards) {
        if (me.My.cards[cardIndex].isSelected) {
          selectedCards.push(cardIndex);
        }
      }

      me.trashIsOk = true;
      socket.emit(
        'dropcard',
        {
          'gameId': me.gameId,
          'playerName': me.My.playerName,
          'cards': selectedCards
        },
        function(response) {
          console.log('dropcard', response);
          if (response.status == 'ok') {
            me.My = response.data.player;
            socket.emit(
              'takecard',
              {
                gameId: me.gameId,
                playerName: me.My.playerName,
                cardCount: 5 - me.My.cards.length
              },
              function(response) {
                console.log('takecard', response);
                if (response.status == 'ok') {
                  me.My = response.data.player;
                  me.currentCardIndex = 0;
                  me.currentCard = me.My.cards[me.currentCardIndex];
                  me.mode = 'play';

                  me.previewIsOk = false;
                  me.playIsOk = false;
                  me.trashIsOk = false;
                  me.trapIsOk = false;
                  me.playIsFinished = false;
                }
              }
            )
          }
        }
      );
    };

    this.takeCards = function(cardCount){
      socket.emit(
        'takecard',
        {
          'gameId': me.gameId,
          'playerName': me.My.playerName,
          'cardCount': cardCount
        },
        function(data) {
          console.log('takecard', data);
          if (data.status == 'ok') {
            socket.emit('my', function(response){
              console.log(response);
              me.My = response.data.player;
              me.removedCardsCount = 0;
            });
          }
        }
      );
    };

    this.pop = function(){
      toaster.pop('success', "title", "text");
    };

    this.play = function() {
      var card = null;
      var index = null;
      me.cardPlayed++;
      for (var cardIndex in me.My.cards) {
        if (me.My.cards[cardIndex].preview && me.My.cards[cardIndex].previewNumber == me.cardPlayed) {
          card = me.My.cards[cardIndex];
          index = cardIndex;
          break;
        }
      }

      if (!card) {
        me.cardPlayed = 0;
        me.previewNumber = 1;
        me.playIsFinished = true;
        me.mode = 'trap';
        me.trapIsOk = true;
        me.currentCardIndex = 0;
        return;
      }

      me.My.cards.splice(index, 1);

      if (card.options && card.options.indexOf('cloud') != -1) {
        socket.emit(
          'movecloud',
          {
            gameId: me.gameId,
            playerName: me.My.playerName,
            cardIndex: index,
            cardPossibilities: card.previewPossibilities
          },
          function(data) {
            if (data.status == 'ok') {
              me.play();
            }
          }
        );
      } else if (card.options && card.options.indexOf('steering-wheel') != -1) {
        socket.emit(
          'movesteeringwheel',
          {
            gameId: me.gameId,
            playerName: me.My.playerName,
            cardIndex: index,
            cardPossibility: card.previewPossibilities[0]
          },
          function(data) {
            if (data.status == 'ok') {
              me.play();
            }
          }
        )
      } else {
        socket.emit(
          'move',
          {
            gameId: me.gameId,
            playerName: me.My.playerName,
            cardIndex: index,
            cardPossibility: card.previewPossibilities[0]
          },
          function(data) {
            if (data.status == 'ok') {
              me.play();
            }
          }
        )
      }
    };

    this.trap = function() {
      var card = null;
      var index = null;

      for (var cardIndex in me.My.cards) {
        if (me.My.cards[cardIndex].isTrapped) {
          card = me.My.cards[cardIndex];
          index = cardIndex;
        }
      }

      if (!card) {
        socket.emit('takecard', {
          gameId: me.gameId,
          playerName: me.My.playerName,
          cardCount: 5 - me.My.cards.length
        }, function (response) {
          console.log('takecard', response);
          if (response.status == 'ok') {
            me.My = response.data.player;
            me.currentCardIndex = 0;
            me.currentCard = me.My.cards[me.currentCardIndex];
            me.mode = 'play';

            me.previewIsOk = false;
            me.playIsOk = false;
            me.trashIsOk = false;
            me.trapIsOk = false;
            me.playIsFinished = false;
          }
        });
      }

    };
  }
})();
