app

.controller('BusinessCtrl', function($scope, $http, $state, $stateParams){	
	
	$scope.user = {};
	$scope.userList = {};

 	if($stateParams.id != undefined)
	{
		$http.get('/api/business/' + $stateParams.id).then(function(response){
				$scope.user = response.data;							
				
				console.log($stateParams.id);
				console.log($scope.user.logoImage.length);

				$scope.user.images = []
				$scope.user.videos = [];
				for (var i = $scope.user.logoImage.length - 1; i >= 0; i--) {

					var ext = $scope.user.logoImage[i].split(".").pop();
					if(ext == "jpg" || ext == "jpeg"|| ext == "gif" || ext=="png")
						$scope.user.images.push($scope.user.logoImage[i]);
					else if(ext == "mp4" || ext == "avi"|| ext == "mkv" || ext == "ogg" || ext == "webm" || 
						ext == "flv" || ext == "swf" )
						$scope.user.videos.push($scope.user.logoImage[i]);
				}

				console.log($scope.user);


			}, function(error){
				console.log('Error' + error);
			})
	}
	// console.log($scope.user);
	
	
	// $scope.isImage();

	$scope.setActive = function(isActive, businessId) {
		$http.post('/api/business/active/' + businessId, {businessStatus : isActive}, {
		}).then(
		function(response){
			console.log(response);
			// $state.go('registeredBusiness');
			window.location.reload(true);
		}, 
		function(error){
			console.log('Error' + error);
		});	
	}

	$http.get('/api/business').then(function(response){				
			$scope.userList = response.data;					
			// console.log(response.data);
			console.log($scope.userList);
		}, function(error){
			console.log('Error' + error);
		})

	$scope.createBusiness = function(data){
		var session = {login: '', userID: ''};
		var uploadUrl = '/api/businessSignup';
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(
		function(response){
			console.log(response);
			localStorage.setItem('user', JSON.stringify(true));
			$state.go('detailUser',{id: response.data._id});
			window.location.reload(true);
			//window.location = "detailUser?id="+response.data._id;

		}, 
		function(error){
			console.log('Error' + error);
		});	
	};

	// For updating Business User Data

	$scope.updateBusiness = function(id){

		var data = $scope.user;
		var uploadUrl = '/api/business/' + id;
		var fd = new FormData();
		for(var key in data)
			fd.append(key, data[key]);
		$http.put(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).then(
		function(response){
			$scope.user = {};
			$scope.userList = response;
			$state.go('detailUser',{id: response.data._id});
			console.log(response);
			console.log("Updated");
		}, 
		function(error){
			console.log('Error' + error);
		})		

	}

	$scope.userSignin = function(data){
		var uploadUrl = '/api/businessSignin';		
		console.log(data.email);
		console.log(data.password);
		if(data != undefined){
			if(data.email != null && data.password != null){
				$http.post(uploadUrl, data).then(
				function(response){					
					if(data.email == response.data[0].email && data.password == response.data[0].password){
						localStorage.setItem('user', JSON.stringify(true));
						$state.go('detailUser',{id: response.data[0]._id});
						window.location.reload(true);
					}
					else{
						alert("Incorrent Email or password");
						$scope.user = {};						
					}					
					
				}, 
				function(error){
					console.log('Error' + error);
				});	
			}

		}
		else{
			console.log("Error in fields");		
		}
	}

	// Delete ALl Business Users

	$scope.deleteAllBusiness = function(){
		$http.delete('/api/business').then(
			function(response){
				// $http.get('/api/business').then(function(response){				
				// 	$scope.userList = response.data;
				// 	console.log(response.data);
				// }, function(error){
				// 	console.log('Error' + error);
				// })
				// $scope.userList = response.data;
				// console.log(response.data);
				console.log("deleted all business users");
				window.location.reload(true);

			},
			function(error){
				console.log('Error' + error);
			})
	}

	// Delete All App Users
	$scope.deleteAllAppUsers = function(){
		$http.delete('/api/users').then(
			function(response){
				console.log("deleted all App users");
				window.location.reload(true);

			},
			function(error){
				console.log('Error' + error);
			})
	}

	// Delete All Checkins
	$scope.deleteAllCheckins = function(){
		$http.delete('/api/checkin').then(
			function(response){
				console.log("deleted all checkins");
				window.location.reload(true);

			},
			function(error){
				console.log('Error' + error);
			})
	}
})

