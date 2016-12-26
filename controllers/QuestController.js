'use strict';
let logger			= require("../libraries/logger"),
	CharacterModel	= require('../models/CharacterModel');

/** Class representing a Quest. */
class Quest {
	static updateNode(req, res){
		CharacterModel.findById(
			req.body.character,								// Query parameters
			function(err, character){								// Get the requested document to deal with data
				if (!err){
					for (let i = character.quests.length - 1; i >= 0; i--) {
						if(character.quests[i].name === req.body.quest) {
							for (let j = character.quests[i].nodes.length - 1; j >= 0; j--) {
								if(character.quests[i].nodes[j].name === req.body.node)
									character.quests[i].nodes[j].completed = req.body.completed;
							}
						}
					}
					CharacterModel.findByIdAndUpdate(							// Load correct model
						character._id,										// Query by item id
						{$set: character},											// New Data
						function(err){											// If error, throw it to client
							if(err) {
								res.status(500).json(err);						// Send error to client
							} else {
								res.status(201).json({							// Send success msg to client
									message: 'quest updated! ', 
								});
							}
						}
					);
				}
				else {
					let errorsMsgs = [];
					for(var index in err.errors) {
						errorsMsgs.push(err.errors[index]['message']);
					}
					logger().error(errorsMsgs);						// Log error
				}
			}
		);
	}

	static resetNodes(req, res){
		CharacterModel.findOneAndUpdate(							// Load correct model
			{slug: req.body.character},								// Query by item slug
			{
				$set: {
					quests: [
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
			},										// New Data
			function(err){											// If error, throw it to client
				if(err) {
					res.status(500).json(err);						// Send error to client
				} else {
					res.status(201).json({							// Send success msg to client
						message: 'quest reseted! ', 
					});
				}
			}
		);
	}
	static statusAll(req, res){
		CharacterModel.findOne(
			{'slug': req.params.character},			// Query parameters
			function(err, character){				// Get the requested document to deal with data
				if (!err){
					let quests = [];
					for (let i = 0; i < character.quests.length ; i++) {
						quests.push(character.quests[i]);
					}
					res.status(201).json({quests: quests})
				}
				else {
					let errorsMsgs = [];
					for(var index in err.errors) {
						errorsMsgs.push(err.errors[index]['message']);
					}
					logger().error(errorsMsgs);						// Log error
				}
			}
		);
	}
}
module.exports = Quest;