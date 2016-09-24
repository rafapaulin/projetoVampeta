'use strict';

// == Requirements ================================================================= //
	let	express	= require('express'),
		Router	= express.Router(),
		User	= require('./controllers/UserController'),
			passport	= require('passport');	
				  require('./libraries/passport');
// ================================================================= Requirements == //
function getItems(req, res){
	switch (req.params.collection) {
		case 'users':
			req.params.slug ? User.show(req, res) : User.list(req, res);
			break;
		case 'characters':
			break;
		default:
			res.status(404).json({message: 'Not found!'})
	}
};

function authStrat(req, res, next){
	switch (req.params.strategy) {
		case 'local':
			User.login(req, res, next);
			break;
		default:
			res.status(404).json({message: 'Not found!'})
	}
};

// == Routes ================================================================= //
	Router
		.get( '/:collection/:slug?', (req, res, next) => User.isLoggedIn(req, res, next), (req, res) => getItems(req, res) )
		//.post( '/auth/:strategy', )
		.post( '/users', (req, res) => User.registerLocal(req, res) )
		.post( '/auth/:strategy', (req, res, next) => authStrat(req, res, next) )
// ================================================================= Routes == //

module.exports = Router;