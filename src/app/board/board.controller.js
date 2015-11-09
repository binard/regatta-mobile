(function() {
  'use strict';

  angular
    .module('regattaMobile')
    .controller('BoardCtrl', boardCtrlFunction);

  boardCtrlFunction.$inject = ['CONFIG', '$routeParams', '$location', '$sce', 'socket', 'toaster'];

  function boardCtrlFunction (CONFIG, $routeParams, $location, $sce, socket, toaster) {
      this.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      var me = this;
      me.gameId = $routeParams.id;
      me.My = {
        cards: []
      };
      me.My = {"playerName":"Thomas","boat":{"color":"#26A65B","number":"51","position":{"x":13,"y":31},"width":1,"length":5,"orientation":90},"started":true,"checkLines":[{"pointA":{"x":12,"y":30},"pointB":{"x":24,"y":30}},{"pointA":{"x":6,"y":7},"pointB":{"x":-200,"y":7}},{"pointA":{"x":6,"y":7},"pointB":{"x":6,"y":-200}},{"pointA":{"x":18,"y":18},"pointB":{"x":18,"y":200}},{"pointA":{"x":18,"y":18},"pointB":{"x":200,"y":18}},{"pointA":{"x":30,"y":7},"pointB":{"x":200,"y":7}},{"pointA":{"x":30,"y":7},"pointB":{"x":30,"y":200}},{"pointA":{"x":12,"y":30},"pointB":{"x":24,"y":30}}],"trappedTime":0,"cards":[{"name":"Triple babord","width":5,"height":7,"svgParams":{"card-trois-gauche":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":3},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"2"},{"moves":[{"x":0,"y":5},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"4"},{"moves":[{"x":0,"y":7},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"}],"options":[],"type":"move","$$hashKey":"object:52"},{"name":"Tout droit nuage","width":5,"height":7,"svgParams":{"card-tout-droit":"display: block;","card-option-nuage":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"}],"options":["cloud"],"type":"move","$$hashKey":"object:53"},{"name":"Tout droit","width":5,"height":7,"svgParams":{"card-tout-droit":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"}],"options":[],"type":"move","$$hashKey":"object:54"},{"name":"Triple babord","width":5,"height":7,"svgParams":{"card-trois-gauche":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":3},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"2"},{"moves":[{"x":0,"y":5},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"4"},{"moves":[{"x":0,"y":7},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"}],"options":[],"type":"move","$$hashKey":"object:55"},{"name":"Joker 1","width":5,"height":7,"svgParams":{"card-joker":"display: block;"},"possibilities":[{"moves":[{"x":0,"y":1},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"0"},{"moves":[{"x":0,"y":4},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"3"},{"moves":[{"x":0,"y":6},{"x":3,"y":0}],"rotation":-90,"possibilityIndex":"6"},{"moves":[{"x":0,"y":5},{"x":2,"y":0},{"x":0,"y":3}],"rotation":0,"possibilityIndex":"7"},{"moves":[{"x":0,"y":8}],"rotation":0,"possibilityIndex":"9"},{"moves":[{"x":0,"y":5},{"x":-2,"y":0},{"x":0,"y":3}],"rotation":0,"possibilityIndex":"11"},{"moves":[{"x":0,"y":6},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"13"},{"moves":[{"x":0,"y":4},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"15"},{"moves":[{"x":0,"y":1},{"x":-3,"y":0}],"rotation":90,"possibilityIndex":"18"}],"options":[],"type":"move","$$hashKey":"object:56"}],"gameId":"1"};
      me.mode = 'move';

      /*socket.emit('my', function(response){
        console.log('my', response);
        me.My = response.data.player;
        me.playerName = me.My.playerName;
        me.currentCardIndex = 0;
      });*/

      this.startRemoteIsVisible = false;
      this.moveMapRemoteIsVisible = false;
      this.cardSelectionIsVisible = false;
      this.selectedCards = [];
      this.currentCard = me.My.cards[0];
      this.removedCardsCount = 0;
      this.previewNumber = 0;

      this.getCurrentImage = function(card){
        var paramStr = '';
        for (var paramIndex in card.svgParams) {
          paramStr += '&' + paramIndex + '=' + encodeURIComponent(card.svgParams[paramIndex]);
        }

        return CONFIG.serverUrl + '/svg?svgfile=carte' + paramStr;
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
        if(me.indexIsPossible(me.currentCard, numPossibilty)) {
          me.currentCard.preview = true;
          me.currentCard.previewNumber = parseInt(me.previewNumber);
          me.previewNumber++;
        }
      };

      this.clearPreview = function() {
        for (var cardIndex in me.My.cards) {
          if (me.My.cards[cardIndex].preview) {
            me.My.cards[cardIndex].preview = false;
            me.My.cards[cardIndex].previewNumber = 0;
          }
        }
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
        var currentIndex = ++index % me.My.cards.length;
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

      this.cardIsSelected = function(index){
        return  _.contains(me.selectedCards, index);
      };

      this.selectCardToggle = function(index){
        if (me.selectedCards.length < 3 && !_.contains(me.selectedCards, index)) {
          me.selectedCards.push(index);
        }
        else {
          var arrayIndex = me.selectedCards.indexOf(index);
          if(arrayIndex > -1){
            me.selectedCards.splice(arrayIndex, 1);
          }
        }
      };

      this.dropCards = function(){
        socket.emit(
          'dropcard',
          {
            'gameId': me.gameId,
            'playerName': me.My.playerName,
            'cards': me.selectedCards
          },
          function(data) {
            console.log('dropcard', data);
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

      this.play = function(){
        if(me.cardSelectionIsVisible && me.selectedCards.length > 0){
          if(confirm('Etes-vous sûr de vouloir échanger ces ' + me.selectedCards.length + ' cartes')){
            me.dropCards();
            me.takeCards(me.selectedCards.length);
            me.selectedCards.splice(0, me.selectedCards.length);
            me.cardSelectionIsVisible = false;
          }
        }
      };

      this.terminate = function() {
        me.takeCards(me.removedCardsCount);
      };

      this.havePlayed  = function(indexPlayed) {
        me.currentCard = null;
        me.My.cards.splice(indexPlayed, 1);
      };

      this.pop = function(){
        toaster.pop('success', "title", "text");
      };
    }
})();
