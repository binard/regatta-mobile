'use strict';

angular.module('regattaMobile')
.controller('JoinCtrl', ['$scope', 'socket', function ($scope, socket) {
    $scope.games = [];
  
		socket.on('connect', function() {
			console.log('connected');

			socket.emit('listgames', function(data) {
				console.log(data);
				$scope.games = data.data;
			});

			socket.on('listgames', function(data) {
				console.log(data);
				$scope.games = data.data;
			});
		});
 }]);
