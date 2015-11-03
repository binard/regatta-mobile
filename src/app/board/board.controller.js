'use strict';

angular.module('regattaMobile')
.controller('BoardCtrl', ['$routeParams', '$location', '$sce', 'socket', function ($routeParams, $location, $sce, socket) {
    this.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    var me = this;
    me.isBegun = false;

    socket.on('connect', function() {
      console.log('connected');

      socket.emit('listgames', function(data) {
        console.log(data);
        me.gameId = data.data[0].id;
        socket.emit('joingame', {
              gameId : me.gameId,
              playerName: "Patrick",
              color: "#FF0000",
              number: 51
            }, function (response) {
                console.log(response);
                socket.emit('startgame', {
                  gameId : me.gameId
                }, function (response) {
                  console.log(response);

                  });
        });
        });
    });
    socket.on('gamelaunched', function(response){
      socket.emit('my', function(response){
        console.log('gamelaunched my', response);
        me.My = response.data.player;
        me.cards = me.My.cards;
      });
    });

	this.isStartedMode = false;
	this.startRemoteIsVisible = false;
	this.moveMapRemoteIsVisible = false;
  this.cardSelectionIsVisible = false;
	this.cards = [];
  this.selectedCards = [];
	this.currentCardIndex = 0;

	//socket.emit('my', function(myResp) {
	//	console.log('my', myResp);
	//	//this.My = myResp.data.player;
     // //this.currentCardIndex = 0;
	//	// if(myResp.data.player.started === startPlayer) {
	//	// 	//$location.path("/start/" + $routeParams.id);
	//	// 	$scope.isStartedMode = true;
	//	// }
	//});

	this.getCurrentImage = function(index){
		var paramStr = '';
		for (var paramIndex in me.My.cards[index].svgParams) {
			paramStr += '&' + paramIndex + '=' + encodeURIComponent(me.My.cards[index].svgParams[paramIndex]);
		}
		return 'http://192.168.1.63:8041/svg?svgfile=carte' + paramStr;
	};

  this.cardDirectionIsSelectable = function(numPossibilty){
    if(me.cards.length > 0) {
      return indexIsPossible(me.cards[me.currentCardIndex], numPossibilty) ? "card-selectable" : "";
    }
    return "";
  };

  this.previewCard = function(numPossibilty){
    if(indexIsPossible(me.cards[me.currentCardIndex], numPossibilty)) {
      console.log("previewCard card : " + me.cards[me.currentCardIndex]);
      console.log("previewCard possbilityIndex : " + numPossibilty);
      me.fnPreviewCard({index : me.currentCardIndex, card : me.cards[me.currentCardIndex], possibility : numPossibilty});
    }
  };

  function indexIsPossible(card, index){
    var isPossibility = false;
    for(var i=0; i < card.possibilities.length; i++){
      if(card.possibilities[i].possibilityIndex == index)
      {
        isPossibility = true;
        break;
      }
    }
    return isPossibility;
  }

	this.showNextCard = function() {
    console.log("showNextCard");
		me.currentCardIndex = ++me.currentCardIndex % 5;
	};

	this.isVisible = function(index) {
		return me.currentCardIndex === index;
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
          socket.emit('my', function(response){
            console.log(response);
            me.My = response.data.player;
          });
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
}]);
