app

.factory('userAuth', function($state, $window){

    return{
        isAdmin: function(){
            auth = false;

            var admin =  JSON.parse(localStorage.getItem('admin'));  
            if(admin == true){
              auth = true;
            }
            
            return auth;
        },
        isAuthenticate: function(){

            auth = false;
            var user =  JSON.parse(localStorage.getItem('user'));  
            if(user == true){
              auth = true;
            }
            return auth;
        },
        userLogout: function(){
            localStorage.removeItem('user');
            localStorage.removeItem('admin');
            $state.go('home');  
        }
    };
})