'use strict';

angular.module('regattaMobile')
.controller('JoinCtrl', ['$scope', 'socket', function ($scope, socket) {
		$scope.title = "Hello";
		socket.on('connect', function() {
			console.log(socket.readyState + " : Connected");

			socket.emit('listgames', function(data) {
				console.log('rep emit listgames', data);
			});

			socket.on('listgames', function(data) {
				console.log('listgames', data);
			});
		});
 }]);