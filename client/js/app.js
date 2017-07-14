var app = angular.module('trendoApp', ['ui.router'])

.run(function($rootScope, $state,$timeout, userAuth) {

    $rootScope.isAdmin = userAuth.isAdmin();
    $rootScope.isAuthenticate = userAuth.isAuthenticate();
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState) {

        $rootScope.isAdmin = userAuth.isAdmin();
        $rootScope.isAuthenticate = userAuth.isAuthenticate();
    })
})


.config(function($stateProvider, $urlRouterProvider){
	$stateProvider

    // For User Routes

	.state('home', {
        url:'/',        
        cache: false,        
        views: {            
            'content@': {
                templateUrl : 'views/home.html',                
                controller  : 'HomeCtrl'
            }
            
        }

    })
    // route for the new signup user
    .state('userSignup', {
        url:'/userSignup',
        // params: {editUser: null},
        cache: false,
        views: {
            'content@': {                
                templateUrl: 'views/userSignup.html',
                controller  : 'BusinessCtrl'
            }
        }
    })
    // route for the signin User page
    .state('userSignin', {
        url:'/userSignin',
        cache: false,
        views: {
            'content@': {
                templateUrl : 'views/userSignin.html',
                // template: '<h1>Hello From  Users list </h1>',
                controller  : 'BusinessCtrl'
            }
        }
    })

    .state('editUser', {
        url:'/editUser/:id',
        cache: false,
        views: {
            'content@': {
                templateUrl : 'views/userSignup.html',
                // template: '<h1>Hello From  Users list </h1>',
                controller  : 'BusinessCtrl'
            }
        }
    })

    // route for the admin signin  page
    .state('adminSignin', {
        url:'/adminSignin',
        cache: false,
        views: {
            'content@': {
                templateUrl : 'views/adminSignin.html',                
                controller  : 'AdminCtrl'
            }
        }
    })

    
    .state('registeredBusiness', {
        url:'/registeredBusiness',
        // params: {editUser: null},
        cache: false,
        views: {
            'content@': {                
                templateUrl: 'views/registeredBusiness.html',
                controller  : 'BusinessCtrl'
            }
        }
    })

    // For details of business user
    .state('detailUser', {
        url:'/detailUser/:id',
        cache: false,
        views: {
            'content@': {
                templateUrl : 'views/detailUser.html',
                // template: '<h1>Hello From  Users list </h1>',
                controller  : 'BusinessCtrl'
            }
        }
    })



	$urlRouterProvider.otherwise('/');

})

;