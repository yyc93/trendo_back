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
	.getPostCommentCheckin = function(req, res){
		PostComment.find({_checkInId: req.params.checkin_id})
		.sort({dateTime: -1})
		.populate('_userID', 'username')
		.exec(function(err, comments){
			if(err){
				res.send(err);
				sendJSONResponse(res, 500, err);
				return;	    			
			}	    		
			sendJSONResponse(res, 200, comments);
			
		});
	};

module
	.exports
	.createPostComment = function(req, res){
		
		var postComment = new PostComment();      
		
		postComment._checkInId = req.body.checkin_id;
		postComment._userID = req.body.userID;
		postComment.commentText = req.body.commentText;
		postComment.dateTime = new Date();
		console.log(postComment);
		
		if( postComment.commentText == null || postComment.commentText.length === 0){
			sendJSONResponse(res, 500, {result: 1, msg: 'Comment could not be empty'});
			return;
		}

		Checkin.findById(postComment._checkInId, function(err, checkin) {
            if(err){
    			sendJSONResponse(res, 500, err);
    			return;	    			
    		}

    		if(checkin == null)
    		{
    			sendJSONResponse(res, 500, {result: 2, msg: 'Invalid checkin id'});
    			return;
			}
			
			User.findById(postComment._userID, function(err, user) {
				if(err || user == null)
				{
					sendJSONResponse(res, 500, {result: 3, msg: 'Invalid User id'});
					return;
				}

				postComment.save((err, comment) => {
					if (err){
						sendJSONResponse(res, 500, err);
						console.log("Save error in postComment");
						return;
					}

					PostComment.populate(comment, {path:"_userID", select: 'username' }, function(err, obj) { 
						if(err){
							res.send(err);
							sendJSONResponse(res, 500, err);
							return;	    			
						}	    		
						sendJSONResponse(res, 200, obj);
					 });
					console.log("Create a postComment successfuly");
				});
			})
        });
	};

