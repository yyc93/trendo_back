'use strict';

var mongoose = require('mongoose');

require('./user.js');
// defining Schema
var Schema = mongoose.Schema;

var checkinSchema = new Schema({
		
		user_id: {
			type: String,
			required: false
		},
		_userID: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		placeName: {
			type: String,
			required: false
		},
		_businessId: {
			type: Schema.Types.ObjectId,
			ref: 'Business'
		},
		address: {
			type: String,
			required: false
			
		},
		latitude:{
			type: String,
			required: false
			
		},
		longitude: {
			type: String,
			required: false
			
		},
		fileUrl:{
			type: String,
			required: false
		},
		thumbUrl:{
			type: String,
			required: false
		},
		checkinType: {
			type: String,
			required: false
		},
		categories: [{
			type: String,
			required: false
		}],
		comment: {
			type: String,
			required: false
		},
		_postComments:  [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comments'
			}
		],
		dateTime: {
			type: Date,
			required: false
		}
});

module.exports = mongoose.model('Checkin', checkinSchema);


