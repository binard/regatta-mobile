'use strict';

angular.module('regattaMobile')
  .controller('PlayerOptionsCtrl', function ($scope, $routeParams, socket) {
  		$scope.gameId = $routeParams.id;
  		$scope.playerName = '';
  		$scope.number = '';
  		$scope.color = '';


  		$scope.validOptions = function() {
  			socket.emit('joingame', { 
  							  gameId : $scope.gameId, 
  							  playerName: $scope.playerName, 
  							  color: $scope.number, 
  							  number: $scope.color 
  							}, function (data) {
  								console.log(data);
							}
						);
  		}
  });