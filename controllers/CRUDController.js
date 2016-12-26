'use strict';
require('../models/PartyModel')
let logger		=	require("../libraries/logger");

class Crud {
/**
 * @description Register a User using Local Strategy (Local account).
 * @description This method is suposed to be used as a middleware.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 * @param {string} model - Model name of the items to be showed (singular, capitalized).
 */
	static create(req, res, next, model){
		let Model = this.modelNamer(model);
		
		if(req.params.collection === 'users'){
			req.body.memberSince = new Date;
			this.slugger(req, req.body.username);	// Create the slug based on userName
		} else {
			this.slugger(req, req.body.name);		// Create the slug based on entity name
			req.body.createdOn = new Date;			// Set the creation date
			req.body.createdBy = req.body.usrid;		// Set the author
		}			

		// == For Testing ============================================================ //
			if(model === 'Character') {
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
			}
		// ============================================================ For Testing == //
		if(model === 'Party'){
			req.body.members = [];
			req.body.members.push(req.body.leader);
		}

		let newData = new Model(req.body);
		newData.save(function(err, char){
			if(!err) {
				let $addToSet = {};
				switch (req.params.collection) {
					case 'users':
						res.status(201).json({message: `Account ${req.body.username} successfully created.`});
						break;
					case 'characters':
						$addToSet['characters'] = newData._id;
						require('../models/UserModel').findByIdAndUpdate(	// Call users Model
							req.body.usrid,										// Query
							{$addToSet}, 									// Add a reference to the created object on the user profile
							function(err, doc) {
								if(!err) {
									console.log('inseriu no array do user.');
									res.status(201).json({
										newCharID: char._id,
										message: `${req.body.name} has arrived at the village.`
									});
								} else {
									let errorsMsgs = [];
									for(var index in err.errors) { 
										errorsMsgs.push(err.errors[index]['message']);
									}
									logger().error(errorsMsgs);				// Log error
									res.status(500).json({message: err});	// Send error to client
								}
							}
						);
						break;
					case 'parties':
						require('../models/CharacterModel').findByIdAndUpdate(
							req.body.leader,
							{$set: {party: newData._id}},
							{new: true},
							function(err, character){
								if(!err) {
									res.status(201).json({
										newPartyID: newData._id,
										message: `${newData.name} has gathered.`
									});
								} else {
									let errorsMsgs = [];
									for(var index in err.errors) { 
										errorsMsgs.push(err.errors[index]['message']);
									}
									logger().error(errorsMsgs);				// Log error
									res.status(500).json({message: err});	// Send error to client
								}
							}
						);
						break;
					default:
						res.status(404).json({message: 'Not found!'})
				}
			} else {
				let errorsMsgs = [];
				for(var index in err.errors) { 
					errorsMsgs.push(err.errors[index]['message']);
				}
				logger().error(errorsMsgs);				// Log error
				res.status(500).json({message: err});	// Send error to client
			}
		});
	}
/**
 * @description Return a JSON with the item data.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 * @param {string} model - Model name of the items to be showed (singular, capitalized).
 */
	static show(req, res, next, model){
		let Model = this.modelNamer(model);

		Model.findOne(
			{'slug': req.params.slug},						// Query parameters
			function(err, item){							// Get the requested document to deal with data
				if (!err)
					res.status(200).json(item);				// Send item to client
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
 * @description Return a list (as array) of JSONs with the items data.
 * @param {object} req - Requisition object (provided by expressjs).
 * @param {object} res - Response object (provided by expressjs).
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 * @param {string} model - Model name of the items to be listed (singular, capitalized).
 */
	static list(req, res, next, model){
		let Model = this.modelNamer(model);
		Model.find(function(err, items){
			if (!err)
				res.status(200).json(items);						// Send list of items to client
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
 * @param {string} username - UserName to be slugfied.
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
/**
 * @description Return the model of the entity as mongoose object.
 * @param {string} model - Model to be loaded (singular, capitalized).
 */
	static modelNamer(model){
		return require('../models/' + model + 'Model')
	}
}
module.exports = Crud;