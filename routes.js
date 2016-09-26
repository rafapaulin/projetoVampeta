'use strict';

// == Requirements ================================================================= //
	let	express		= require('express'),
		Router		= express.Router(),
		User		= require('./controllers/UserController'),
		Character	= require('./controllers/CharacterController'),
		Quest		= require('./controllers/QuestController'),
		passport	= require('passport');
					  require('./libraries/passport');
// ================================================================= Requirements == //
/**
 /** @function getItems()
 * @description Selects to which route send the request, based on the URI called.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
function getItems(req, res){
	switch (req.params.collection) {
		case 'users':
			req.params.slug ? User.show(req, res) : User.list(req, res);
			break;
		case 'characters':
			req.params.slug ? Character.show(req, res) : Character.list(req, res);
			break;
		default:
			res.status(404).json({message: 'Not found!'})
	}
};
/**
 /** @function authStrat()
 * @description Selects which login strategy to use, based on the URI called.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 */
function authStrat(req, res, next){
	switch (req.params.strategy) {
		case 'local':
			User.login(req, res, next);
			break;
		case 'logout':
			User.logOut(req, res);
			break;
	}
};

// == Routes ================================================================= //
	Router
		.get( '/:collection/:slug?',	(req, res, next) => User.isLoggedIn(req, res, next), (req, res) => getItems(req, res) )

		.post( '/auth/:strategy',		(req, res, next) => authStrat(req, res, next) )
		
		.post('/quests/update',			(req, res) => Quest.updateNode(req, res) )
		.post('/quests/reset',			(req, res) => Quest.resetNodes(req, res) )

		.post( '/users',				(req, res) => User.registerLocal(req, res) )
		.post( '/characters',			(req, res, next) => User.isLoggedIn(req, res, next), (req, res) => Character.create(req, res) )

// ================================================================= Routes == //

module.exports = Router;