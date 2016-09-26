'use strict';
require('../libraries/passport');

let logger		= require("../libraries/logger"),
	passport	= require('passport');	
/** Class representing a User. */
class User {
/**
 * @description Logs the user in.
 * @description This method is suposed to be used as a middleware.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 */
	static login(req, res, next){
		let scope;
		scope = function(err, user, info){
			if (err) return next(err);
			if (user) {										// Check for user
				if (err) return next(err);
				req.login(user, function (err) {			// Stabilishes Session for the user
					if (err) return next(err);
				})
				res.json(user);
				next();
			} else {
				res.status(500).json(info);					// Send error object to front end
			}
		}
		return passport.authenticate('local', scope)(req, res, next);
	}
/**
 * @description Check if the user is logged in
 * @description This method is suposed to be used as the first middleware in a route if the user must be logged in to recieve the data.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 */
	static isLoggedIn(req, res, next){
		if (req.isAuthenticated()){
			console.log('Autenticado!!!');
			return next();
		} else {
			res.status(401).json({message: 'Not Logged in'});
		}
	}
	// static update(){}
	// static delete(){}

/**
 * @description Logs the user out, destroying current session
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
	static logOut(req, res){
		req.logout();
		res.redirect('/');
	}
}

module.exports = User;