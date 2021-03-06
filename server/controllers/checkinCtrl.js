'use strict';

var mongoose = require('mongoose');
var Checkin = mongoose.model('Checkin');
var Business = mongoose.model('Business');
var User = mongoose.model('User');
var PostComment = mongoose.model('Comments');

var sendJSONResponse = function(res, status, content){
	res.status(status);
    res.json(content);
};

module
	.exports
	.getAllCheckin = function(req, res){
		Checkin.find()
		.sort({dateTime: -1})
		.populate('_userID', 'email username userType')
		.exec(function(err, checkin){
			if(err){
				res.send(err);
				sendJSONResponse(res, 500, err);	    			
			}	    		
			sendJSONResponse(res, 200, checkin);
		});	    
	};


module
	.exports
	.getUserCheckin = function(req, res){
		Checkin.find({_userID: req.params.user_id})
		.sort({dateTime: -1})
		.populate('_userID', 'email username userType')
		.exec(function(err, checkin){
			if(err){
				res.send(err);
				sendJSONResponse(res, 500, err);	    			
			}	    		
			sendJSONResponse(res, 200, checkin);
			
		});
	};


module
	.exports
	.getBusinessCheckin = function(req, res){
		Checkin.find({_businessId: req.params.businessId})
		.sort({dateTime: -1})
		.populate('_userID', 'email username userType')
		.exec(function(err, checkin){
			if(err){
				res.send(err);
				sendJSONResponse(res, 500, err);	    			
			}	    		
			sendJSONResponse(res, 200, checkin);
			
		});
	};

module
	.exports
	.getConnectionCheckin = function(req, res){

		User.find({ _id: req.params.user_id },function(err, user){
			if(err){
    			res.send(err);
    			sendJSONResponse(res, 500, err);	    			
    		}

    		console.log(user[0]);

    		if(user[0].userConnection.length == 0)
    		{
    			sendJSONResponse(res, 200, {});
    			return;
    		}

    		Checkin.find({ user_id: { $in: user[0].userConnection }})
    		.sort({dateTime: -1})
    		.populate('_userID', 'email username userType')
	    	.exec(function(err, checkins){
	    		console.log(err);
	    		console.log(checkins);
	    		if(err){
	    			sendJSONResponse(res, 500, err);	    			
	    		}
	    		sendJSONResponse(res, 200, checkins);
	    	});	
		});
	};

module
	.exports
	.createCheckin = function(req, res){
		
		var checkin = new Checkin();      
		
		checkin.user_id = req.body.user_id;
		checkin._userID = req.body.user_id;
		checkin.placeName = req.body.name;
		checkin.address = req.body.address;
		checkin.latitude= req.body.latitude;
		checkin.longitude = req.body.longitude;	 
		checkin.checkinType = req.body.checkinType;
		checkin.categories = req.body.categories; 
		checkin.comment = req.body.comment; 
		checkin.fileUrl = req.body.fileUrl;
		checkin.thumbUrl = req.body.thumbUrl;
		checkin.dateTime = new Date();

		console.log(checkin);
		Business.find({businessName: req.body.name}, function(err, business){
			console.log(business);
			if(business != null && business.length > 0)
			{
				checkin._businessId = business[0]._id;
				checkin.save(function(err, checkin) {
					business[0].checkInCount = business[0].checkInCount + 1;
					business[0].save();

					if (err){	            
						sendJSONResponse(res, 500, err);
						console.log("Error in checkin ");
					}
				});
			}
			else
			{
				var business = new Business();      // create a new instance of the User model

				business.businessTitle = req.body.name;
				business.category = 'Miscellaneous';
				business.businessName = req.body.name;
				business.userType = "Business";
				business.checkInCount = 1;

				business.save(function(err, business) {
					console.log(err);
					if(business != undefined)
					{
						checkin._businessId = business._id;
					}

					checkin.save(function(err, checkin) {
						if (err){
							sendJSONResponse(res, 500, err);
							console.log("Error in checkin ");
						}
					});
					
				});
			}

			User.findById(req.body.user_id, function(err, user) {
					if (!err && user != null){	                
						user.userCheckins.push(checkin._id);
						user.save();
					}
					sendJSONResponse(res, 200, checkin);
					console.log(checkin);
					console.log("checkin user success");
				});	    
		});
	};

module
	.exports
	.updateSingleCheckin = function(req, res){
		
    	var filename = req.files[0].filename;
		var dest = req.files[0].destination;
		var path = req.files[0].path;
		var herokuURL = "https://trendo-admin.herokuapp.com/server/uploads/";
		var herokuFileURL = herokuURL + filename;
		
        Checkin.findById(req.params.checkin_id, function(err, checkin) {
            if(err){
    			sendJSONResponse(res, 500, err);
    			return;	    			
    		}

    		if(checkin == null)
    		{
    			sendJSONResponse(res, 500, {msg: 'No checkin available'});
    			return;	  
    		}

	        checkin.fileUrl = herokuFileURL;
            checkin.save(function(err) {
                if (err)                    
                	sendJSONResponse(res, 500, err);                
                sendJSONResponse(res, 200, checkin);
            });

        });
	    
	};

module
	.exports
	.getAllUserCheckin = function(req, res){
		Checkin.find(function(err, checkins){
			if(err){
				sendJSONResponse(res, 500, err);
				return;	    			
			}

			if(checkins == null)
			{
				sendJSONResponse(res, 500, {msg: 'No checkin available !'});
				return;	  
			}
			sendJSONResponse(res, 200, checkins);
			
		});
	};

module
	.exports
	.removeOldCheckin = function(req, res){
		Checkin.find(function(err, checkin){
			if(err){
				sendJSONResponse(res, 500, err);
				return;	    			
			}

			if(checkin == null)
			{
				sendJSONResponse(res, 500, {msg: 'No checkin available !'});
				return;	  
			}
			sendJSONResponse(res, 200, checkin);
			
		});    
	};

module
	.exports
	.deleteCheckin = function(req, res){
		PostComment.deleteMany( { _checkInId: req.params.checkin_id }, function(err, obj) {
			if (err){
				console.error("Some PostComment delete error for deleteCheckin");
				console.log(obj);
				return;
			}				
			console.log("Some PostComment delete success for deleteCheckin : " + obj.result.n + " document(s) deleted");
		});
		
		Checkin.deleteOne({
			_id: req.params.checkin_id
		}, function(err, user) {
			if (err){
				console.error("deleteCheckin error : "+err);
				sendJSONResponse(res, 500, err);
				return;
			}
			console.log("deleteCheckin success : "+user);
			sendJSONResponse(res, 200, user);
		});
	};	


// For deleting all checkins
module
	.exports
	.deleteAllCheckins = function(req, res){
		PostComment.deleteMany({}, function(err, comment) {
			if (err){
				console.error("PostComments delete error for deleteAllCheckins");
				console.log(comment);
				return;
			}				
			console.log("PostComments delete success for deleteAllCheckins : " + comment.result.n + " document(s) deleted");
		});
		Checkin.deleteMany({}, function(err, checkin) {
			if (err){					
				console.error("deleteAllCheckins error : "+err);
				sendJSONResponse(res, 500, err);
				return;
			}
			console.log("deleteAllCheckins success : " + checkin.result.n + " document(s) deleted");
			sendJSONResponse(res, 200, checkin);
		});
	};

module
	.exports
	.createNewPostComment = function(req, res){
		var newComment = new PostComment();
		
		newComment._checkInId = req.body.checkin_id;
		newComment._userID = req.body.userID;
		newComment.commentText = req.body.commentText;
		newComment.dateTime = new Date();

		if( newComment.commentText == null || newComment.commentText.length === 0){
			sendJSONResponse(res, 500, {result: 1, msg: 'Comment could not be empty'});
			return;
		}
		Checkin.findById(newComment._checkInId, function(err, checkin) {
			if(err){
				sendJSONResponse(res, 500, err);
				return;	    			
			}

			if(checkin == null)
			{
				sendJSONResponse(res, 500, {result: 2, msg: 'Invalid checkin id'});
				return;
			}
			
			User.findById(newComment._userID, function(err, user) {
				if(err || user == null)
				{
					sendJSONResponse(res, 500, {result: 3, msg: 'Invalid User id'});
					return;
				}

				newComment.save((err, comment) => {
					if (err){
						sendJSONResponse(res, 500, err);
						console.log("Save error in postComment");
						return;
					}

					checkin._postComments.push(comment._id);
					checkin.save(function(err) {
						if (err)
							sendJSONResponse(res, 500, err);
						
						PostComment.populate(comment, {path:"_userID", select: 'username' }, function(err, obj) { 
							if(err){
								res.send(err);
								sendJSONResponse(res, 500, err);
							}
							console.log("Create a postComment successfuly");
							sendJSONResponse(res, 200, obj);
						});
					});
				});
			})
		});
	};

module
	.exports
	.getPostCommentCheckin = function(req, res){
		Checkin.findById(req.params.checkin_id)
		.populate('_postComments')
		.exec(function(err, checkin){
			if(err){
				res.send(err);
				sendJSONResponse(res, 500, err);
				return;		
			}
			if( checkin == null){
				sendJSONResponse(res, 500, {result:1, msg:"Invalid checkin id"});
				return;
			}

			PostComment.find({_checkInId: checkin._id})
			.sort({dateTime: -1})
			.populate('_userID', 'username')
			.exec(function(err, comments){
				if(err){
					res.send(err);
					sendJSONResponse(res, 500, err);	    			
				}
				if( comments.length != checkin._postComments.length ) {
					checkin._postComments = [];
					for(var comment in comments){
						checkin._postComments.push(comment._id);
					}
					checkin.save(function(err) {
						if (err){
							sendJSONResponse(res, 500, err);
							return;
						}

					});
				}
				sendJSONResponse(res, 200, comments);					
			});
		});			
	};
