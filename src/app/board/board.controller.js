'use strict';

angular.module('regattaMobile')
.controller('BoardCtrl', ['$routeParams', '$location', 'socket', function ($routeParams, $location, socket) {
    var me = this;
    me.IsBegun = false;

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
        console.log(response);
        me.My = response.data.player;
      });
    });

	// this.My = {
     //    'playerName':'Thomas',
     //    'boat':{
     //       'color':'#8F1D21',
     //       'number':'64',
     //       'position':{
     //          'x':13,
     //          'y':31
     //       },
     //       'width':1,
     //       'length':3,
     //       'orientation':90
     //    },
     //    'started':false,
     //    'checkLines':[
     //       {
     //          'pointA':{
     //             'x':12,
     //             'y':30
     //          },
     //          'pointB':{
     //             'x':24,
     //             'y':30
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':6,
     //             'y':7
     //          },
     //          'pointB':{
     //             'x':0,
     //             'y':7
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':6,
     //             'y':7
     //          },
     //          'pointB':{
     //             'x':6,
     //             'y':0
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':18,
     //             'y':18
     //          },
     //          'pointB':{
     //             'x':18,
     //             'y':70
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':18,
     //             'y':18
     //          },
     //          'pointB':{
     //             'x':70,
     //             'y':18
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':30,
     //             'y':7
     //          },
     //          'pointB':{
     //             'x':30,
     //             'y':0
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':30,
     //             'y':7
     //          },
     //          'pointB':{
     //             'x':40,
     //             'y':7
     //          }
     //       },
     //       {
     //          'pointA':{
     //             'x':12,
     //             'y':30
     //          },
     //          'pointB':{
     //             'x':24,
     //             'y':30
     //          }
     //       }
     //    ],
     //    'trappedTime':0,
     //    'cards':[
     //       {
     //          'name':'Trident',
     //          'width':5,
     //          'height':7,
     //          'svgParams':{
     //             'card-soleil':'display: none;',
     //             'card-tout-droit':'display: none;',
     //             'card-un-droite':'display: none;',
     //             'card-un-gauche':'display: none;',
     //             'card-trois-droite':'display: none;',
     //             'card-trois-gauche':'display: none;',
     //             'card-trident':'display: block;',
     //             'card-option-nuage':'display: none;',
     //             'card-option-barre-a-roue':'display: none;',
     //             'card-joker':'display: none;',
     //             'card-joker-2':'display: none;'
     //          },
     //          'possibilities':[
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':-1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':8
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             }
     //          ],
     //          'type':'move',
     //          '$$hashKey':'object:11'
     //       },
     //       {
     //          'name':'Sun',
     //          'width':5,
     //          'height':7,
     //          'svgParams':{
     //             'card-soleil':'display: block;',
     //             'card-tout-droit':'display: none;',
     //             'card-un-droite':'display: none;',
     //             'card-un-gauche':'display: none;',
     //             'card-trois-droite':'display: none;',
     //             'card-trois-gauche':'display: none;',
     //             'card-trident':'display: none;',
     //             'card-option-nuage':'display: none;',
     //             'card-option-barre-a-roue':'display: none;',
     //             'card-joker':'display: none;',
     //             'card-joker-2':'display: none;'
     //          },
     //          'possibilities':[
    //
     //          ],
     //          'type':'trap',
     //          '$$hashKey':'object:12'
     //       },
     //       {
     //          'name':'Trident nuage',
     //          'width':5,
     //          'height':7,
     //          'svgParams':{
     //             'card-soleil':'display: none;',
     //             'card-tout-droit':'display: none;',
     //             'card-un-droite':'display: none;',
     //             'card-un-gauche':'display: none;',
     //             'card-trois-droite':'display: none;',
     //             'card-trois-gauche':'display: none;',
     //             'card-trident':'display: block;',
     //             'card-option-nuage':'display: block;',
     //             'card-option-barre-a-roue':'display: none;',
     //             'card-joker':'display: none;',
     //             'card-joker-2':'display: none;'
     //          },
     //          'possibilities':[
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':-1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':8
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             }
     //          ],
     //          'options':[
     //             'Cloud'
     //          ],
     //          'type':'move',
     //          '$$hashKey':'object:13'
     //       },
     //       {
     //          'name':'Trident nuage',
     //          'width':5,
     //          'height':7,
     //          'svgParams':{
     //             'card-soleil':'display: none;',
     //             'card-tout-droit':'display: none;',
     //             'card-un-droite':'display: none;',
     //             'card-un-gauche':'display: none;',
     //             'card-trois-droite':'display: none;',
     //             'card-trois-gauche':'display: none;',
     //             'card-trident':'display: block;',
     //             'card-option-nuage':'display: block;',
     //             'card-option-barre-a-roue':'display: none;',
     //             'card-joker':'display: none;',
     //             'card-joker-2':'display: none;'
     //          },
     //          'possibilities':[
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':-1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':8
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             }
     //          ],
     //          'options':[
     //             'Cloud'
     //          ],
     //          'type':'move',
     //          '$$hashKey':'object:14'
     //       },
     //       {
     //          'name':'Trident nuage',
     //          'width':5,
     //          'height':7,
     //          'svgParams':{
     //             'card-soleil':'display: none;',
     //             'card-tout-droit':'display: none;',
     //             'card-un-droite':'display: none;',
     //             'card-un-gauche':'display: none;',
     //             'card-trois-droite':'display: none;',
     //             'card-trois-gauche':'display: none;',
     //             'card-trident':'display: block;',
     //             'card-option-nuage':'display: block;',
     //             'card-option-barre-a-roue':'display: none;',
     //             'card-joker':'display: none;',
     //             'card-joker-2':'display: none;'
     //          },
     //          'possibilities':[
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':-1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':8
     //                   }
     //                ],
     //                'rotation':0
     //             },
     //             {
     //                'moves':[
     //                   {
     //                      'x':0,
     //                      'y':5
     //                   },
     //                   {
     //                      'x':1,
     //                      'y':0
     //                   },
     //                   {
     //                      'x':0,
     //                      'y':3
     //                   }
     //                ],
     //                'rotation':0
     //             }
     //          ],
     //          'options':[
     //             'Cloud'
     //          ],
     //          'type':'move',
     //          '$$hashKey':'object:15'
     //       }
     //    ],
     //    'gameId':'2'
	//};

	this.isStartedMode = false;
	this.startRemoteIsVisible = false;
	this.moveMapRemoteIsVisible = false;
	this.cards = [];
	this.currentCardIndex = 0;

	socket.emit('my', function(myResp) {
		console.log('my', myResp);
		//this.My = myResp.data.player;
      //this.currentCardIndex = 0;
		// if(myResp.data.player.started === startPlayer) {
		// 	//$location.path("/start/" + $routeParams.id);
		// 	$scope.isStartedMode = true;
		// }
	});

	this.getCurrentImage = function(index){
		var paramStr = '';
		for (var paramIndex in me.My.cards[index].svgParams) {
			paramStr += '&' + paramIndex + '=' + encodeURIComponent(me.My.cards[index].svgParams[paramIndex]);
		}
		return 'http://localhost:8041/svg?svgfile=carte' + paramStr;
	};

	this.showNextCard = function() {
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
}]);
