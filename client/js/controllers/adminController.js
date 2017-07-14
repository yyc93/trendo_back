app

.controller('AdminCtrl', function($rootScope, $scope, $http, $state, $stateParams){		
	
	$scope.adminUsername = "admin";
	$scope.adminPassword = "admin";

	$scope.adminSignin = function()
	{
				
		if($scope.username != undefined && $scope.password != undefined){
			if($scope.username != "" && $scope.password != "")
			{
				if($scope.adminUsername == $scope.username && $scope.adminPassword == $scope.password){
					console.log("Login Successfully");					
					$state.go('registeredBusiness');
					localStorage.setItem('admin', JSON.stringify(true));
					$state.go('registeredBusiness');
				}
				else{
					alert("Incorrect Login Details !");
				}
				
			}
			else{
				alert("Information Incorrect");
			}
		}

	}
})

