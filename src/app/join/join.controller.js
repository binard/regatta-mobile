'use strict';

angular.module('regattaMobile')
.controller('JoinCtrl', ['CONFIG', '$scope', 'socket', function (CONFIG, $scope, socket) {
    $scope.games = [];
	socket.on('connect', function() {
		console.log('connected');

		socket.emit('listgames', function(data) {
			console.log(data);
			$scope.games = data.data;
		});

		socket.on('listgames', function(data) {
			console.log(data);
			$scope.games = data;
		});
	});
 }]);
