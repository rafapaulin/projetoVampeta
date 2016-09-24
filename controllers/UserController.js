'use strict';

let UserModel	= require('../models/UserModel'),
	logger		= require("../libraries/logger"),
	passport	= require('passport');	
				  require('../libraries/passport');
/** Class representing a User. */
class User {
/**
 * Register a User using Local Strategy (Local account).
 * @param {string} username - A unique username for the new user.
 * @param {string} email - A unique email for the new user.
 */
	static registerLocal(req, res){
		if(req.body.userName)
			this.slugger(req, req.body.userName);		// Create the slug based on userName
		req.body.memberSince = new Date;				// Set the creation date

		new UserModel(req.body).save(function(err){
			if(!err)
				res.status(201).json({message: `account ${req.body.userName} successfully created. Please log in.`});
			else {
				let errorsMsgs = [];
				for(var index in err.errors) { 
					errorsMsgs.push(err.errors[index]['message']);
				}
				logger().error(errorsMsgs);						// Log error
				res.status(500).json({message: errorsMsgs});	// Send error to client
			}
		});
	}
	static show(req, res){
		UserModel.findOne(
			{'slug': req.params.slug},								// Query parameters
			function(err, user){									// Get the requested document to deal with data
				if (!err)
					res.status(200).json(user);						// Send item to client
				else {
					let errorsMsgs = [];
					for(var index in err.errors) {
						errorsMsgs.push(err.errors[index]['message']);
					}
					logger().error(errorsMsgs);						// Log error
					res.status(500).json({message: errorsMsgs});	// Send error to client
				}
			}
		);
	}
	static list(req, res){
		UserModel.find(function(err, users){
			if (!err)
				res.status(200).json(users);						// Send list of items to client
			else {
				let errorsMsgs = [];
				for(var index in err.errors) { 
					errorsMsgs.push(err.errors[index]['message']);
				}
				logger().error(errorsMsgs);							// Log error
				res.status(500).json({message: errorsMsgs});		// Send error to client
			}
		});
	}
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
     * Slugfy the User name provided for routing purposes.
     * @param {object} req - requisition containing the User Data.
     * @param {string} username - User name provided to be slugfied.
     */
	static slugger(req, username){
		var slug = require('slug');				// Require slug plugin only if needed
		req.body.slug = slug(username, {		// Automatic generate slugs based on name
			replacement: '-',					// replace spaces with replacement 
			symbols: true,						// replace unicode symbols or not 
			remove: null,						// (optional) regex to remove characters 
			lower: true,						// result in lower case 
			charmap: slug.charmap,				// replace special characters 
			multicharmap: slug.multicharmap		// replace multi-characters 
		});
	}
}

module.exports = User;