'use strict';
// == Requirements ================================================================= //
	var mongoose	=	require('mongoose').connect((process.env.MONGODB_URI || 'mongodb://127.0.0.1/test')),
		express		=	require('express'),
		routes		=	require('./routes'),
		cookie		=	require('cookie-parser'),
		bodyParser	=	require('body-parser'),
		session		=	require('express-session'),
		passport	=	require('passport'),
		logger		=	require("./libraries/logger"),
		app			=	express();
// ================================================================= Requirements == //

	app.set('port', (process.env.PORT || 8666));
	app.use(express.static('public'));
	app.use(cookie());
	app.use(bodyParser.json());
	app.use(session(
		{
			secret: (process.env.SESSION_SECRET || 'vampeta'),
			resave: false,
			saveUninitialized: true,
			cookie: {secure: false}
		}
	));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use('/', routes);

// == DB Connection check ========================================================== //
	mongoose.connection
		.once('open', () => logger().info('Server successfully conected to database'))
		.on('error', error => logger().error(`Server cannot connect to database: ${error.message}`));
// ========================================================== DB Connection check == //

// == Server Start ================================================================= //
	app.listen(app.get('port'), () => logger().info(`Listening on port ${app.get('port')}`) );
// ================================================================= Server Start == //