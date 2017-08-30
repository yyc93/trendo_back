'use strict';

var mongoose = require('mongoose');

// defining Schema
var Schema = mongoose.Schema;

var postCommentSchema = new Schema({
		_checkInId: {
			type: Schema.Types.ObjectId,
			ref: 'Checkin'
		},
		_userID: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		commentText: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 1000
		},
		dateTime: {
			type: Date,
			required: false
		}
});

module.exports = mongoose.model('Comments', postCommentSchema);