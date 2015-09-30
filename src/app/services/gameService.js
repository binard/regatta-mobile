// angular.module('regattaMobile').service('gameService',['socket', function (socket) 
// 	this.games = [];

// 	socket.on('connect', function() {
// 		console.log('connected');

// 		socket.emit('listgames', function(data) {
// 			console.log(data);
// 			this.games = data.data;
// 			$rootScope.$broadcast('gamesListUpdated', this.games);
// 		});

// 		socket.on('listgames', function(data) {
// 			console.log(data);
// 			this.games = data.data;
// 		});
// 	});

// 	return {
// 		getListGames(){

// 		}
// 	}

// }]);