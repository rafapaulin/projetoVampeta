'use strict';
// == Requirements ================================================================= //
	var mongoose	= require('mongoose').connect('mongodb://vampeta:vampetaFTW@ds025583.mlab.com:25583/heroku_bs4683k6'),
		express		= require('express'),
		routes		= require('./routes'),
// ================================================================= Requirements == //

// == Global Variables ============================================================= //
		app = express(),
		 db = mongoose.connection;
// ============================================================= Global Variables == //

// == Middlewares ================================================================== //
	app.set('port', (process.env.PORT || 8666));
	app.use(express.static('public'));
	app.use('/', routes);
	
// ================================================================== Middlewares == //

// == DB Connection check ========================================================== //
	db.on('error', function(){console.log('connection error:')});
	db.once('open', function() {console.log('Yay! Mongo!')});
// ========================================================== DB Connection check == //

// == Server Start ================================================================= //
	app.listen(app.get('port'), function() {
		console.log('Node app is running on port', app.get('port'));
	});
// ================================================================= Server Start == //