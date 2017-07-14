'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
// var methodOverride = require('method-override');

// db for database connections
require('./server/model/db.js')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './client/images/uploads')
    cb(null, 'server/uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})

process.env.PWD = process.cwd()

// parse application/vnd.api+json as json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// to retrieve the data from body
app.use(bodyParser.urlencoded({extended: false, limit: '50mb', parameterLimit: 1000000}));
// // to render the data in json
app.use(bodyParser.json({limit: '50mb'}));

// app.use(multer({dest: './client/images/uploads'}).any());

app.use(multer({storage: storage}).any());


// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
// app.use(methodOverride('X-HTTP-Method-Override')); 

// to access client static files
app.use(express.static('./client'));

// to access server static files/images
// app.use(express.static('./server/uploads'));

app.use('/server',express.static('./server'));
// app.use('/listPledge',express.static(process.env.PWD + '/server'));

// use routes.js file after express.static function to serve the client
// routes ==================================================
require('./server/routes/routes.js')(app); // configure our routes


// start app ===============================================
// startup our app at http://localhost:8080
var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log('App Listening on localhost:' + port);
});               


module.exports = app;



















