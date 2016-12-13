'use strict';

// == Requirements ================================================================= //
	let	express		= require('express'),
		Router		= express.Router(),
		User		= require('./controllers/UserController'),
		Quest		= require('./controllers/QuestController'),
		Crud 		= require('./controllers/CRUDController'),
		Party		= require('./controllers/PartyController'),
		passport	= require('passport');
					  require('./libraries/passport');
// ================================================================= Requirements == //
/**
 /** @function getItems()
 * @description Selects to which route send the request, based on the URI called.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
function getItems(req, res, next){
	switch (req.params.collection) {
		case 'users':
			req.params.slug ? Crud.show(req, res, next, 'User') : Crud.list(req, res, next,'User');
			break;
		case 'characters':
			req.params.slug ? Crud.show(req, res, next, 'Character') : Crud.list(req, res, next, 'Character');
			break;
		default:
			res.status(404).json({message: 'Not found!'})
	}
};
/**
 /** @function createItems()
 * @description Selects to which route send the request, based on the URI called.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
function createItems(req, res, next){
	switch (req.params.collection) {
		case 'users':
			Crud.create(req, res, next,'User');
			break;
		case 'characters':
			Crud.create(req, res, next, 'Character');
			break;
		case 'parties':
			Crud.create(req, res, next, 'Party');
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
		.post( '/auth/:strategy',		(req, res, next) => authStrat(req, res, next) )
		.get( '/auth/:strategy',		(req, res, next) => authStrat(req, res, next) )
		
		.post('/quests/update',			(req, res) => Quest.updateNode(req, res) )
		.post('/quests/reset',			(req, res) => Quest.resetNodes(req, res) )
		.get( '/quests/:character',		(req, res) => Quest.statusAll(req, res))

		.post( '/user/characters', 		(req, res) => User.charList(req, res) )

		.post( '/parties/newMember',	(req, res, next) =>  Party.addMember(req, res, next) )

		.get( '/:collection/:slug?',	(req, res, next) => getItems(req, res) )
		.post('/:collection/',			(req, res, next) => createItems(req, res, next) );

// ================================================================= Routes == //

module.exports = Router;