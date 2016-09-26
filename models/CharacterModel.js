'use strict';
var	mongoose		= require('mongoose'),
	uniqueV			= require('mongoose-unique-validator'),
	Model			= mongoose.Schema,
	autopopulate	= require('mongoose-autopopulate'),

	CharacterModel	= new Model({
		name: {
			type: String,
			unique: true,
			uniqueCaseInsensitive: true
		},
		slug: {
			type: String,
			unique: true,
			uniqueCaseInsensitive: true
		},
		race: {
			type: String
		},
		class: {
			type: String
		},
		quests: [
			{
				name: String,
				nodes: [
					{
						name: String,
						completed: Boolean
					}
				]
			}
		],
		createdAt: {
			type: Date
		},
		createdBy: {
			type: Model.Types.ObjectId,
			ref: 'User',
			autopopulate: {
				select: 'userName'
			}
		}
	},
	{
		collection: 'characters'
	});

CharacterModel.plugin(uniqueV);								// validate unique values
CharacterModel.plugin(autopopulate);						// Autopopulate users

module.exports = mongoose.model('Character', CharacterModel);	// Export module