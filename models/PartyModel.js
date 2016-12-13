'use strict';
var	mongoose		= require('mongoose'),
	Model			= mongoose.Schema,
	uniqueV			= require('mongoose-unique-validator'),
	autopopulate	= require('mongoose-autopopulate'),

	PartyModel	= new Model({
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
		leader: {
			type: Model.Types.ObjectId,
			ref: 'Character',
			autopopulate: {
				select: 'name'
			}
		},
		members: [
			{
				type: Model.Types.ObjectId,
				ref: 'Character',
				autopopulate: {
					select: 'name'
				}
			}
		],
		createdOn: {
			type: Date
		}
	},
	{
		collection: 'parties'
	});

PartyModel.plugin(uniqueV);								// validate unique values
PartyModel.plugin(autopopulate);						// Autopopulate users

module.exports = mongoose.model('Party', PartyModel);	// Export module