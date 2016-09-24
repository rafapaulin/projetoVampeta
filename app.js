'use strict';
// == Requirements ================================================================= //
	var mongoose	=	require('mongoose').connect('mongodb://vampeta:vampetaFTW@ds025583.mlab.com:25583/heroku_bs4683k6'),
		express		=	require('express'),
		routes		=	require('./routes'),
		bodyParser	=	require('body-parser'),
		session		=	require('express-session'),
		passport	=	require('passport'),
		logger		=	require("./libraries/logger"),
// ================================================================= Requirements == //

// == Environment Variables ======================================================== //
		app			=	express(),
		db			=	mongoose.connection;

	app.set('port', (process.env.PORT || 8666));
	app.set('views', __dirname + '/views');
	app.use(express.static('public'));
	app.use('/', routes);
// ======================================================== Environment Variables == //

// == DB Connection check ========================================================== //
	db.on('error', error => logger().error('Server cannot connect to database:', error.errmsg));
	db.once('open', () => logger().info('Server successfully conected to database'));
// ========================================================== DB Connection check == //

// == Server Start ================================================================= //
	app.listen(app.get('port'), function() {
		logger().info('Listening on port %s', app.get('port'));
	});
// ================================================================= Server Start == //