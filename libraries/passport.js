'use strict';
// == Requirements ================================================================================================================== //
	var	passport	= require('passport'),
		User		= require('../models/UserModel'),
		//logger		= require("../libraries/logger"),
		localStrat	= require('passport-local').Strategy;
		//FacebookStrategy = require('passport-facebook').Strategy,
		//TwitterStrategy = require('passport-twitter').Strategy,
		//GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
// ================================================================================================================== Requirements == //

// == LOCAL login strategy ========================================================================================================== //
/** 
 * @function passport.use(strategy)
 * @description This method logs the user in using local api credentials.
 * @param {string} strategy - Strategy used to authenticate the user.
 * @param {string} name - name provided by the user.
 * @param {string} password - Password provided by the user.
 * @param {function} done - Callback function that return the authenticated user object.
 */
	passport.use('local', new localStrat(
		function(username, password, done) {
			User.findOne({
				$or: [						// Try to login using username or email
					{username: username},
					{email: username},
				]
			}, function(err, user) {
				if (err){
					//logger().error('FODEU!');
					return done(err);
				}

				if (!user) {					// Check for existing username. If not, return a message
					//logger().debug('not user');
					return done(null, false, {message: `${username} is not a user yet. Please Sign up!`});
				};
				user.validPassword(password, function(err, isMatch){
					if(err){
						//logger().error(err);				// Log error
						res.status(500).json({message: err});	// Send error to client
					}
					if(isMatch){														// If password does match, return the user object
						//logger().debug(user);
						return done(null, user);
					} else {															// If password does not match, return a message to user.
						//logger().debug('not valid password');
						return done(null, false, {message: 'Incorrect password.' });
					}
				})
			});
		}
	));
// ========================================================================================================== LOCAL login strategy == //

// == Cookie handling =============================================================================================================== //
	passport.serializeUser(function(user, done) {		// Create cookie
		console.log('serializou!');
		done(null, user);
	});

	passport.deserializeUser(function(id, done) {		// Read cookie and find logged user
		console.log('deserializou!');
		User.findById(id, function(err, user) {
			done(null, user);
		});
	});
// =============================================================================================================== Cookie handling == //