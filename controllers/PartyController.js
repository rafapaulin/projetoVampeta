'use strict';
let logger			= require("../libraries/logger"),
	CharacterModel	= require('../models/CharacterModel'),
	PartyModel		= require('../models/PartyModel');

/** Class representing a Party. */
class Party {
	static addMember(req, res){
		let $addToSet = {};
		$addToSet['members'] = req.body.newPartyMember;
		PartyModel.findByIdAndUpdate(
			req.body.party,
			{$addToSet},
			function(err, party){
				if(!err) {
					CharacterModel.findByIdAndUpdate(
						req.body.newPartyMember,
						{$set: {party: req.body.party}},
						function(err, char){
							if(!err){
								res.status(201).json({message: `${char.name} has joined the party ${party.name}.`});
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
	}
}
module.exports = Party;