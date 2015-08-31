'use strict';

angular.module('regattaMobile')
  .controller('PlayerOptionsCtrl', function ($scope, $routeParams, $location, socket) {
  		$scope.gameId = $routeParams.id;
  		$scope.playerName = '';
  		$scope.number = '';
  		$scope.color = '';


  		$scope.validOptions = function() {
  			socket.emit('joingame', { 
  							  gameId : $scope.gameId, 
  							  playerName: $scope.playerName, 
  							  color: $scope.color, 
  							  number: $scope.number 
  							}, function (response) {
                  console.log("joingame", response);
  								if(response.status === "error") {
                    alert(response.data.message);
                  }
                  else {
                    $location.path("/playersvalidation/" + $scope.gameId);
                  }
							}
						);
  		}
  });