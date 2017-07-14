'use strict';

var mongoose = require('mongoose');

// Requiring business user model
var Business = mongoose.model('Business');
var Checkin = mongoose.model('Checkin');
var User = mongoose.model('User');

var sendJSONResponse = function(res, status, content){
	res.status(status);
    res.json(content);
};


// For Getting All  business Users
module
	.exports
	.getAllUsers = function(req, res){
		// getting the business users 	    
	    	Business.find(function(err, users){
	    		if(err){
	    			res.send(err);
	    			sendJSONResponse(res, 500, err);	    			
	    		}	    		
	    		sendJSONResponse(res, 200, users);
	    		
	    	});
	    		    
	};


// For creating business User
module
	.exports
	.createUser = function(req, res){

		Business.find({ email: req.body.email },function(err, users){

    		if(users.length > 0)
    		{
    			sendJSONResponse(res, 500, { msg: "Email already exists" });
    			return;
    		}
    		var herokuImageURL = [];
			var logoFile = [];
			for(var i=0; i<req.files.length; i++){
				var filename = req.files[i].filename;
				var dest = req.files[i].destination;
				var path = req.files[i].path;
				var herokuURL = "https://trendo-admin.herokuapp.com/server/uploads/";
				var imageURL = herokuURL + filename;
				
				herokuImageURL.push(imageURL);
				logoFile.push(filename);
			}
			    
		    var user = new Business();      // create a new instance of the User model
	        user.firstName = req.body.firstName;
	        user.lastName = req.body.lastName;
	        user.phone = req.body.phone;
	        user.email= req.body.email;
	        user.password = req.body.password;
	        user.businessTitle = req.body.businessTitle;	        
	        user.category = req.body.category;	        	        	        
	        user.businessYear= req.body.businessYear;
	        user.businessName = req.body.businessName;
	        user.businessAddress = req.body.businessAddress;	        
	        user.businessDays = req.body.businessDays;	        	        	        
	        user.businessPhone = req.body.businessPhone;
	        user.businessEmail = req.body.businessEmail;	        
	        user.businessDescription = req.body.businessDescription;
	        user.logoImage = logoFile;
		    user.logoImageURI = herokuImageURL;
	        user.userType = "Business";
	        user.save(function(err, user) {
	            if (err){	            
	            	sendJSONResponse(res, 500, err);
	            	console.log("Error in posting user");
	            }	             
	            sendJSONResponse(res, 200, user);	            
	            console.log(user);
	            console.log("posting user");
	        });
		})
		
	};


// For getting single Business User		
module
	.exports
	.getSingleUser = function(req, res){		
	        Business.findById(req.params.business_id)
	        .populate({
	        	path: 'businessCheckins', 
			  	model: 'Checkin',
			  	populate: {
			    	path: '_userID',
			    	model: 'Checkin'
			  	}
			})
	       	.exec(function(err, user) {
	            if (err){	                
	                sendJSONResponse(res, 500, err);	                
	            }
	            sendJSONResponse(res, 200, user);
	        });	    
	};


module
	.exports
	.updateBusinessStatus = function(req, res){
		Business.findById(req.params.business_id, function(err, business) {
			if (err){
                sendJSONResponse(res, 500, err);
                return;
            }

            if(business == null)
            {
            	sendJSONResponse(res, 500, {msg: 'invalid id'});
            	return;
            }

            business.isActive = req.body.businessStatus;
            business.save(function(err) {
                if (err)                    
                	sendJSONResponse(res, 500, err); 
                	               
                sendJSONResponse(res, 200, business);
            });
		});
	}
// For updating single Business User
module
	.exports
	.updateSingleUser = function(req, res){
		
    	var herokuImageURL = [];
		var logoFile = [];
		for(var i=0; i<req.files.length; i++){
			var filename = req.files[i].filename;
			var dest = req.files[i].destination;
			var path = req.files[i].path;
			var herokuURL = "https://trendo-admin.herokuapp.com/server/uploads/";
			var imageURL = herokuURL + filename;
			
			herokuImageURL.push(imageURL);
			logoFile.push(filename);
		}
		
		Business.findById(req.params.business_id, function(err, user) {

            if (err)                
            	sendJSONResponse(res, 500, err);

	        user.firstName = req.body.firstName;
	        user.lastName = req.body.lastName;
	        user.phone = req.body.phone;
	        user.email= req.body.email;
	        user.password = req.body.password;
	        user.businessTitle = req.body.businessTitle;	        
	        user.category = req.body.category;	        	        	        
	        user.businessYear= req.body.businessYear;
	        user.businessName = req.body.businessName;
	        user.businessAddress = req.body.businessAddress;	        
	        user.businessDays = req.body.businessDays;	        	        	        
	        user.businessPhone = req.body.businessPhone;
	        user.businessEmail = req.body.businessEmail;	        
	        user.businessDescription = req.body.businessDescription;
	        user.logoImage = logoFile;
	        user.logoImageURI = herokuImageURL;
	        user.userType = "Business";

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
	        Business.remove({
	            _id: req.params.user_id
	        }, function(err, user) {
	            if (err)	    
	            	sendJSONResponse(res, 500, err);	            
	            sendJSONResponse(res, 200, user);
	        });	    
	};	


// For deleting a user
module
	.exports
	.deleteAllUsers = function(req, res){		
	        Business.remove({}, function(err, user) {
	            if (err)	    
	            	sendJSONResponse(res, 500, err);	            
	            sendJSONResponse(res, 200, user);
	        });	    
	};	


// For App User Sign in
module
	.exports
	.getSignin = function(req, res){		

		var newEmail = req.body.email;	        
	    var newPassword = req.body.password;	        
        Business.find({email: newEmail, password: newPassword},function(err, users){
    		if(err){
    			res.send(err);
    			sendJSONResponse(res, 500, err);	    			
    		}	    		
    		sendJSONResponse(res, 200, users);
    		
    	});	            	        	

	};

module
	.exports
	.findBusiness = function(req, res){
        var query = req.body.query;
		Business.find({"name": '/'+ query + '/'}, function(err, user) {
            if (err){                   
                sendJSONResponse(res, 500, err);                    
            }
            sendJSONResponse(res, 200, user);
        });     
};


module
	.exports
	.findRandomBusiness = function(req, res){

        Business.count().exec(function (err, count) {

		// Get a random entry
		var random = Math.floor(Math.random() * count)

		// Again query all users but only fetch one offset by our random #
		Business.findOne().skip(random).exec(
		    function (err, result) {
		    	sendJSONResponse(res, 200, result);
		    })
		})    
};


module
	.exports
	.deleteAll = function(req, res){
		Business.remove({}, function (err, result) {
			console.log(err);
			console.log(result);
		});
		Checkin.remove({}, function (err, result) {
			console.log(err);
			console.log(result);
		});
		User.remove({}, function (err, result) {
			console.log(err);
			console.log(result);
		});
		sendJSONResponse(res, 200, 'ok');
};











