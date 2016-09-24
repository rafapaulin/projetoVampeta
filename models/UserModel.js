'use strict';
var	mongoose		= require('mongoose'),
	uniqueV			= require('mongoose-unique-validator'),
	Model			= mongoose.Schema,
	autopopulate	= require('mongoose-autopopulate'),
	bcrypt			= require('bcrypt'),
	saltFactor		= 10,

	UserModel		= new Model({
// == General ================================================================================================================================= //
			userName: {
				type: String,
				unique: true,
				uniqueCaseInsensitive: true
			},
			password: {
				type: String,
				minlength: 4
			},
			slug: {
				type: String,
				unique: true,
				uniqueCaseInsensitive: true
			},
			name: {
				type: String
			},
			email: {
				type: String,
				unique: true,
				uniqueCaseInsensitive: true
			},
			country: {
				type: String
			},
			memberSince: {
				type: Date
			},
			characters: {},
			// socialIDs: {
			// 	facebook: {
			// 		id:	{type: String},
			// 		email: {type: String},
			// 		name: {type: String},
			// 		profileLink: {type: String},
			// 		profilePic: {type: String},
			// 		token: {type: String},
			// 		secret: {type: String}
			// 	},
			// 	twitter: {
			// 		id: {type: String},
			// 		email: {type: String},
			// 		name: {type: String},
			// 		profileLink: {type: String},
			// 		profilePic: {type: String},
			// 		token: {type: String},
			// 		secret: {type: String},
			// 		screenName: {type: String}
			// 	},
			// 	google: {
			// 		id: {type: String},
			// 		email: {type: String},
			// 		name: {type: String},
			// 		profileLink: {type: String},
			// 		profilePic: {type: String},
			// 		token: {type: String},
			// 		secret: {type: String}
			// 	}
			// },
// ================================================================================================================================= General == //
		},
		{
			collection: 'users'
		}
	);

// == Password hashing ====================================================================================================================== //
	UserModel.pre('save', function(next) {
		var user = this;	

		if (!user.isModified('password')) return next();				// Only hash the password if it has been modified (or is new)

		bcrypt.genSalt(saltFactor, function(err, salt) {				// generate a salt
			if (err)
				return next(err);

			bcrypt.hash(user.password, salt, function(err, hash) {		// hash the password using our new salt
				if (err)
					return next(err);

				user.password = hash;									// override the cleartext password with the hashed one
				next();
		    });
		});
	});
// ====================================================================================================================== Password hashing == //

// == Password verification ================================================================================================================= //
	UserModel.methods.validPassword = function(candidatePassword, cb) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return cb(err);
			console.log('isMatch? ' + isMatch)
			cb(null, isMatch);
		});
	};
// ================================================================================================================= Password verification == //

UserModel.plugin(uniqueV);								// validate unique values
UserModel.plugin(autopopulate);						// Autopopulate users

module.exports = mongoose.model('Users', UserModel);	// Export module