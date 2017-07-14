'use strict';

var mongoose = require('mongoose');

// defining Schema
var Schema = mongoose.Schema;

var businessSchema = new Schema({
		firstName: {
			type: String,
			required: false
		},
		lastName: {
			type: String,
			required: false
		},
		phone: {
			type: String,
			required: false
		},
		email:{
			type: String,
			required: false
		 },
		password: {
			type: String,
			required: false
		},
		businessTitle: {
			type: String,
			required: false
		},
		category:{
			type: String,
			required: false
		},
		businessYear: {
			type: String,
			required: false
		},
		businessName: {
			type: String,
			required: false		
		},
		businessAddress: {
			type: String,
			required: false
		},
		businessDays:{
			type: String,
			required: false
		},
		businessPhone: {
			type: String,
			required: false
		},
		businessEmail:{
			type: String,
			required: false
		},
		businessDescription: {
			type: String,
			required: false
		},
		logoImage: [
			{
				type: String,
				required: false
			}
		],
		logoImageURI: [
			{
				type: String,
				required: false
			}	
		],
		userType: {
			type: String,
			required: false
		},
		isActive: {
			type: Boolean,
			default: false
		},
		checkInCount: {
			type: Number,
			required: false,
			default: 0,
		},
		businessCheckins : [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Checkin'
			}
		],
});

module.exports = mongoose.model('Business', businessSchema);