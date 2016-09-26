'use strict';
let CharacterModel	= require('../models/CharacterModel'),
	logger			= require("../libraries/logger");

/** Class representing a Character. */
class Character {
/**
 * @description Creates a character in the logged user account.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
	static create(req, res){
		this.slugger(req, req.body.name);	// Create the slug based on character name
		req.body.createdAt = new Date;		// Set the creation date
		req.body.createdBy = req.user._id;	// Set the author

		// == For Testing ============================================================ //
			req.body.quests = [
				{
					name: 'Vampeta\'s First Quest',
					nodes: [
						{
							name: 'First node',
							completed: false
						},
						{
							name: 'Second node',
							completed: false
						},
						{
							name: 'Third node',
							completed: false
						},
						{
							name: 'Boss',
							completed: false
						}
					]
				}
			]
		// ============================================================ For Testing == //

		new CharacterModel(req.body).save(function(err){
			if(!err)
				res.status(201).json({message: `${req.body.name} has arrived at the village.`});
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
/**
 * @description Return a JSON with the character data.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
	static show(req, res){
		CharacterModel.findOne(
			{'slug': req.params.slug},								// Query parameters
			function(err, character){								// Get the requested document to deal with data
				if (!err)
					res.status(200).json(character);				// Send item to client
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
/**
 * @description Return a list (as array) of JSONs with the characters data.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 */
	static list(req, res){
		CharacterModel.find(function(err, character){
			if (!err)
				res.status(200).json(character);						// Send list of items to client
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
/**
 * @description Slugfy the User name provided for routing purposes.
 * @param {object} req - requisition containing the User Data that will be updated by the method.
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

module.exports = Character;