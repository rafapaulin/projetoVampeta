'use strict';
var	mongoose		= require('mongoose'),
	uniqueV			= require('mongoose-unique-validator'),
	Model			= mongoose.Schema,
	autopopulate	= require('mongoose-autopopulate'),
	bcrypt			= require('bcrypt'),
	saltFactor		= 10,

	UserModel		= new Model({
		name: {
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
		nameRL: {
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
		characters: [
			{
				type: Model.Types.ObjectId,
				ref: 'Character'
			}
		],
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
	},
	{
		collection: 'users'
	});

// == Password hashing ====================================================================================================================== //
/**
 * Password Hasher.
 * @param {function} next - Callback function that calls the next middleware (provided by expressjs).
 * @param {string} salt - Password salter (provided by bcrypt).
 * @param {string} hash - Criptographed password (provided by bcrypt).
 */
	UserModel.pre('save', function(next) {
		var user = this;	

		if (!user.isModified('password')) return next();				// Only hash the password if it has been modified (or is new)

		bcrypt.genSalt(saltFactor, function(err, salt) {				// generate a salt
			if (err)
				return next(err);
			bcrypt.hash(user.password, salt, function(err, hash) {		// hash the password using our new salt
				if (err)
					return next(err);

				user.password = hash;									// overwrite the cleartext password with the hashed one
				next();
		    });
		});
	});
// ====================================================================================================================== Password hashing == //

// == Password verification ================================================================================================================= //
/**
 * Password Hasher.
 * @param {strin} candidatePassword - Password inserted by the user to try to login.
 * @param {function} cb - Return the error or the success of the password check.
 * @param {boolean} isMatch - Flag if the inserted password matches the one stored in database (provided by bcrypt).
 */
	UserModel.methods.validPassword = function(candidatePassword, cb) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		});
	};
// ================================================================================================================= Password verification == //

UserModel.plugin(uniqueV);								// validate unique values
UserModel.plugin(autopopulate);						// Autopopulate users

module.exports = mongoose.model('User', UserModel);	// Export module