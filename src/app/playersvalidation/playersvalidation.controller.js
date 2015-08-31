'use strict';

angular.module('regattaMobile')
.controller('PlayersValidationCtrl', ['$scope', '$routeParams', '$location', 'socket', function ($scope, $routeParams, $location, socket) {

    $scope.validPlayersAndStart = function() {
    		console.log('validPlayersAndStart', $routeParams.id);
			socket.emit('startgame', { 
					  gameId : $routeParams.id
					}, function (response) {
						if(response.status === "error") {
							console.log("startgame error", response);
    						alert(response.data.message);
  						}
					});

			socket.on('gamelaunched', function(startPlayer){
				console.log('gamelaunched', startPlayer);
				socket.emit('my', function(myResp) {
					console.log('my', myResp);
					if(myResp.data.player.playerName === startPlayer) {
						$location.path("/start/" + $routeParams.id);		
					}
				});
			});			
    }
}]);