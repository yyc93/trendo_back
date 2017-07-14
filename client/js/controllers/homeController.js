app

.controller('HomeCtrl', function($window, $rootScope, $scope, userAuth, $state){	
	
	$rootScope.logoutShow = JSON.parse(localStorage.getItem('user'));  
	if($rootScope.logoutShow == "true"){
      $rootScope.logoutShow = true;     
    }
    else if($rootScope.logoutShow == "false"){
     $rootScope.logoutShow = false; 
    }

	$scope.logout = function(){
		userAuth.userLogout();
		$rootScope.logoutShow = false;
		window.location.reload(true);
	}
	
})

