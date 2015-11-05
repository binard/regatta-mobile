'use strict';

angular.module('regattaMobile')
  .controller('PlayerOptionsCtrl', function ($scope, $routeParams, $location, socket) {
  		$scope.gameId = $routeParams.id;
  		$scope.playerName = '';
  		$scope.number = '';
  		$scope.selectedColor = null;
      $scope.colors = [
        {
          name : 'blue',
          hexa : '#1F4788'
        },
        {
          name : 'red',
          hexa : '#8F1D21'
        },
        {
          name : 'yellow',
          hexa : '#FFB61E'
        },
        {
          name : 'green',
          hexa : '#26A65B'
        },
        {
          name : 'purple',
          hexa : '#8E44AD'
        }
      ];

      $scope.changeSelectedColor = function(index){
        $scope.selectedColor = $scope.colors[index];
      };

  		$scope.validOptions = function() {
  			socket.emit('joingame', {
  							  gameId : $scope.gameId,
  							  playerName: $scope.playerName,
  							  color: $scope.selectedColor.hexa,
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
  		};
  });
