'use strict';

var mongoose = require('mongoose');

// for connecting to mongoose
//mongoose.connect('mongodb://localhost:27017/trendo');

mongoose.connect('mongodb://trendo:trendo@ds157469.mlab.com:57469/trendo');

// for opening the connection

var db = mongoose.connection;
db.once('open', function(){
	console.log('connected to database');
});

db.on('error', console.error.bind(console, 'connection error'));