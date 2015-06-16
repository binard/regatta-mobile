'use strict';

angular.module('regattaMobile')
.controller('JoinCtrl', ['$scope', 'socket', function ($scope, socket) {
		$scope.title = "Hello";
		socket.on('connect', function() {
			log(socket.readyState + " : Connected");

			socket.emit('listgames', function(data) {
				console.log(data);
			});
		});
 }]);