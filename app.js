'use strict';
// == Requirements ================================================================= //
	var mongoose	=	require('mongoose').connect('mongodb://vampeta:vampetaFTW@ds025583.mlab.com:25583/heroku_bs4683k6'),
		express		=	require('express'),
		routes		=	require('./routes'),
		cookie		=	require('cookie-parser'),
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
	app.use(cookie());
	app.use(bodyParser.json());
	app.use(session(
		{
			secret: 'chalah, head chalah, não importa o que aconteça....',
			resave: false,
			saveUninitialized: true,
			cookie: {secure: false}
		}
	));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/', routes);
// ======================================================== Environment Variables == //

// == DB Connection check ========================================================== //
	db.on('error', error => logger().error('Server cannot connect to database:', error.errmsg));
	db.once('open', () => logger().info('Server successfully conected to database'));
	//db.on('error', error => console.log('Server cannot connect to database:', error.errmsg));
	//db.once('open', () => console.log('Server successfully conected to database'));
// ========================================================== DB Connection check == //

// == Server Start ================================================================= //
console.log('mongoDB URI: ', process.env.MONGODB_URI);
	app.listen(app.get('port'), function() {
	    //console.log('Listening on port %s', app.get('port'));
		logger().info('Listening on port %s', app.get('port'));
	});
// ================================================================= Server Start == //