'use strict';

var mongoose = require('mongoose');
var fs = require('fs');

// Requiring user model
var User = mongoose.model('User');
var Checkin = mongoose.model('Checkin');

var sendJSONResponse = function(res, status, content){
	res.status(status);
    res.json(content);
};


// For Getting All Signup App Users
module
	.exports
	.getAllUsers = function(req, res){
	   	
    	User
    	.find()
    	.populate('userCheckins checkins')
    	.populate('userConnection users')
    	.exec(function(err, users){
    		if(err){
	    		sendJSONResponse(res, 500, err);
	    		return;
	    	}
    		sendJSONResponse(res, 200, users);	
    	})

	};


// For creating User
module
	.exports
	.createUser = function(req, res){
		
		var checkUserName = function(){
			
		}

		User.find({ username: req.body.username },function(err, users){

    		if(users.length > 0)
    		{
    			sendJSONResponse(res, 500, { msg: "Username already exists" });
    			return;
    		}

    		User.find({ email: req.body.email },function(err, users){
	    		if(users.length > 0)
	    		{
	    			sendJSONResponse(res, 500, { msg: "Email address already exist" });
	    			return;
	    		}

	    		var user = new User();
        
		        user.firstname = req.body.firstname;
		        user.lastname = req.body.lastname;
		        user.username = req.body.username;
		        user.email= req.body.email;
		        user.password = req.body.password;	
		        user.userType = "App";
		        
		        if(req.body.avatar != undefined)
		        {
		        	var file = "server/uploads/" + user.username + ".png";
			       	var base64Data = req.body.avatar.replace(/^data:image\/\w+;base64,/, '');

			        fs.writeFile(file, base64Data, {encoding: 'base64'}, function(err) {
			        	console.log(err);
						user.avatar = file;
						user.save(function(err, user) {
				            if (err){
				            	sendJSONResponse(res, 500, err);
				            	console.log("Error in signup user");
				            	return;
				            }	             
				            sendJSONResponse(res, 200, user);	            
				            console.log(user);
				            console.log("signup user");
				        });
					});
		        }

		        user.save(function(err, user) {
		            if (err){
		            	sendJSONResponse(res, 500, err);
		            	console.log("Error in signup user");
		            	return;
		            }	             
		            sendJSONResponse(res, 200, user);	            
		            console.log(user);
		            console.log("signup user");
		        });
		        
	    	});
    	});
	};


module
	.exports
	.facebookLogin = function(req, res){

		User.findOne({ facebookId: req.body.facebookId })
        .populate('userCheckins checkins')
        .populate('userConnection users')
        .populate('connectionRequest users')
        .exec(function(err, user){
            if (err){	                
                sendJSONResponse(res, 500, err);	                
            }

            if(user == null)
    		{
    			var username = req.body.email.substring(0, req.body.email.lastIndexOf("@"));
				User.find({ username: username },function(err, users){

		    		if(users.length > 0)
		    			username = username + '' + Math.random().toString(36).substr(2, 3);

			    		var user = new User();
		        
				        user.firstname = req.body.name.substring(0, req.body.name.indexOf(" "));
				        user.lastname = req.body.name.substring(req.body.name.lastIndexOf(" "));
				        user.username = username;
				        user.email= req.body.email;
				        user.password = Math.random().toString(36).substr(2, 9);
				        user.userType = "App";
				        user.facebookId = req.body.facebookId;
				        user.avatar = req.body.avatar;
				        console.log(user);
				        user.save(function(err, user) {
				            if (err){
				            	sendJSONResponse(res, 500, err);
				            	console.log("Error in signup user");
				            	return;
				            }	             
				            sendJSONResponse(res, 200, user);	            
				            console.log(user);
				            console.log("signup user");
				        });
		    	});

		    	return;
    		}

            sendJSONResponse(res, 200, user);
        });
	};	


// For getting single singup User		
module
	.exports
	.getSingleUser = function(req, res){		
	        User.findById(req.params.user_id)
	        .populate('userCheckins checkins')
	        .populate('userConnection users')
	        .populate('connectionRequest users')
	        .exec(function(err, user){
	            if (err){	                
	                sendJSONResponse(res, 500, err);	                
	            }
	            sendJSONResponse(res, 200, user);
	        });	    
	};

// For updating single User
module
	.exports
	.updateSingleUser = function(req, res){
		
        User.findById(req.params.user_id, function(err, user) {

            if (err)                
            	sendJSONResponse(res, 500, err);

	        // user.firstname = req.body.firstname;
	        // user.lastname = req.body.lastname;
	        // user.username = req.body.username;
	        // user.email= req.body.email;
	        // user.password = req.body.password;
	        // user.autoFriend = req.body.autoFriend;
	        user.autoFriend = req.body.autoFriend;

            // save the user
            user.save(function(err) {
                if (err)                    
                	sendJSONResponse(res, 500, err);                
                sendJSONResponse(res, 200, user);
            });

        });
	    
	};


// For deleting a user
module
	.exports
	.deleteSingleUser = function(req, res){		
	        User.remove({
	            _id: req.params.user_id
	        }, function(err, user) {
	            if (err)	    
	            	sendJSONResponse(res, 500, err);	            
	            sendJSONResponse(res, 200, user);
	        });	    
	};	


// For creating User
module
	.exports
	.getSignin = function(req, res){
		
        var newUsername = req.body.username;
        var newPassword = req.body.password;

        User.findOne({ username: newUsername, password: newPassword })
        .populate('userCheckins checkins')
        .populate('userConnection users')
        .populate('connectionRequest users')
        .exec(function(err, user){
            if (err){	                
                sendJSONResponse(res, 500, err);	                
            }

            if(user == null)
    		{
    			sendJSONResponse(res, 500, {msg: 'Invalid username or password'});
    			return;	  
    		}

            sendJSONResponse(res, 200, user);
        });	
	};

module
	.exports
	.makeFriend = function(req, res){
        var userID = req.body.user_id;
        var friendID = req.body.friend_id;
		User.findById(userID, function(err, user) {
            if (err){                   
                sendJSONResponse(res, 500, err);                    
            }

           	if(user.userConnection.indexOf(friendID) >= 0)
           	{
				sendJSONResponse(res, 500, {msg: 'You are already friend of this user'});
				return;
           	}

            user.userConnection.push(friendID);
            user.save();

            User.findById(friendID, function(err, user) {
            	if(user.autoFriend == true)
            		user.userConnection.push(userID);
            	else
            		user.connectionRequest.push(userID);

            	user.save();
            });

            sendJSONResponse(res, 200, user);
            console.log("friend user success");
        });     
	    		    
};

module
	.exports
	.accpetFriendRequest = function(req, res){
        var userID = req.body.user_id;
        var friendID = req.body.friend_id;
		User.findById(friendID, function(err, user) {
            if (err){                   
                sendJSONResponse(res, 500, err);                    
            }

           	if(user.userConnection.indexOf(userID) >= 0)
           	{
				sendJSONResponse(res, 500, {msg: 'You are already friend of this user'});
				return;
           	}

            user.userConnection.push(userID);
            user.save();

            User.findById(userID, function(err, user) {
            	if(user.connectionRequest.indexOf(friendID) >= 0)
	           	{
					suser.connectionRequest.splice(0, user.userConnection.indexOf(friendID));
					user.save();
	           	}
            });

            sendJSONResponse(res, 200, user);                            
        });     
	    		    
};

module
	.exports
	.unFriend = function(req, res){
        var userID = req.body.user_id;
        var friendID = req.body.friend_id;
		User.findById(userID, function(err, user) {
            if (err){                   
                sendJSONResponse(res, 500, err);                    
            }

           	if(user.userConnection.indexOf(friendID) >= 0)
           	{
				user.userConnection.splice(0, user.userConnection.indexOf(friendID));
				user.save();
				sendJSONResponse(res, 200, user);
           	}
           	else
           	{
           		sendJSONResponse(res, 500, {msg: 'No data found'});
           	}
        });     
	    		    
};

module
	.exports
	.findUser = function(req, res){
        var query = req.params.query;
        console.log(query);
		User.find({"firstname": {'$regex': query}}, function(err, user) {
            if (err){                   
                sendJSONResponse(res, 500, err);
            }
            sendJSONResponse(res, 200, user);
        });     
};

// For deleting a user
module
	.exports
	.deleteAllUsers = function(req, res){		
	        User.remove({}, function(err, user) {
	            if (err)	    
	            	sendJSONResponse(res, 500, err);	            
	            sendJSONResponse(res, 200, user);
	        })
};