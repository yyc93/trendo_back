'use strict';

var mongoose = require('mongoose');

var User = require('../model/user.js');
var Business = require('../model/business.js');
var Checkin = require('../model/checkin.js');
var PostComment = require('../model/post_comments.js');

var express = require('express');
var router = express.Router();

//  Requiring controller as a service
var userService = require('../controllers/usersCtrl.js');
var businessService = require('../controllers/businessCtrl.js');
var checkinService = require('../controllers/checkinCtrl.js');
var postCommentService = require('../controllers/postCommentCtrl.js');

module.exports = function(app) {


	// middleware to use for all requests
	router.use(function(req, res, next) {
	    console.log('Something is happening.');
	    next();
	});

	// for root request
	router.get('/', function(req, res){
		res.json({ message: 'Welcome to our API' });
	});


	router.get('/users', userService.getAllUsers);
	router.get('/users/:user_id', userService.getSingleUser);
	router.put('/users/:user_id', userService.updateSingleUser);
	router.delete('/users', userService.deleteAllUsers);
	router.delete('/users/:user_id', userService.deleteSingleUser);
	router.post('/userSignup', userService.createUser);
	router.post('/userSignin', userService.getSignin);
	router.post('/users/connect', userService.makeFriend);
	router.get('/users/find/:query', userService.findUser);

	router.post('/users/unfriend', userService.unFriend);
	router.post('/users/accpetfriend', userService.accpetFriendRequest);

	router.post('/users/facebookLogin', userService.facebookLogin);



	router.get('/business', businessService.getAllUsers);
	router.post('/businessSignup', businessService.createUser);
	router.get('/business/:business_id', businessService.getSingleUser);
	router.put('/business/:business_id', businessService.updateSingleUser);
	router.delete('/business', businessService.deleteAllUsers);
	router.delete('/business/:business_id', businessService.deleteSingleUser);
	router.post('/business/active/:business_id', businessService.updateBusinessStatus);
	router.post('/businessSignin', businessService.getSignin);

	router.get('/business/find/:query', businessService.findBusiness);
	router.get('/business-random', businessService.findBusiness);
	router.get('/delete-all', businessService.deleteAll);
	router.get('/businessAds', businessService.findRandomBusiness);
	
	router.post('/checkin', checkinService.createCheckin);
	router.post('/checkin/comment/newcomment', checkinService.createNewPostComment);
	router.get('/checkin/comment/:checkin_id', checkinService.getPostCommentCheckin);
	router.delete('/checkin', checkinService.deleteAllCheckins);
	router.get('/user-checkin/:user_id', checkinService.getUserCheckin);
	router.get('/business-checkin/:businessId', checkinService.getBusinessCheckin);
	router.get('/connection-checkin/:user_id', checkinService.getConnectionCheckin);
	router.get('/checkin/:type', checkinService.getAllCheckin);
	router.post('/upload/:checkin_id', checkinService.updateSingleCheckin);
	router.get('/checkin/delete/:checkin_id', checkinService.deleteCheckin);
	
	// router.get('/comment/:checkin_id', postCommentService.getPostCommentCheckin);
	// router.post('/comment/newpost', postCommentService.createPostComment);
	
    // REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);
}