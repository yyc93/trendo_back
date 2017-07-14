'use strict';

var mongoose = require('mongoose');

require('./checkin.js');

var Schema = mongoose.Schema;

var userSchema = new Schema({
		
		firstname: {
			type: String,
			required: true
		},
		lastname: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true,
			unique: true
		},
		email:{
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
			
		},
		userType: {
			type: String,
			required: true
		},
		autoFriend: {
			type: Boolean,
			required: false,
			default: true
		},
		avatar: {
			type: String,
			required: false
		},
		facebookId: {
			type: String,
			required: false
		},
		userCheckins : [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Checkin'
			}
		],
		userConnection : [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		],
		connectionRequest : [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			}
		]

});

module.exports = mongoose.model('User', userSchema);


