const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const randtoken = require('rand-token');

const userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	token: {
		type: Schema.Types.ObjectId,
		ref: 'Token',
		default: null
	}
});

const tokenSchema = mongoose.Schema({
	value: String,
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	expireAt: {
		type: Date,
		expires: 60, // 60 seconds,
		default: Date.now
	}
});

userSchema.methods.generateToken = function() {

	let token = new Token();
	token.value = randtoken.generate(32); // 32 digit token
	token.user = this._id; // reference this user object who calls this method
	this.token = token._id; // save user's token property as token
	this.save((err) => { // save user with new token property
		if(err)
			throw err;

		token.save((err) => {
			if(err)
				throw err;
		});
	});
};

// ASYNCHRONOUS VERSION
userSchema.methods.generateHash = (password) => {
	const saltRounds = 9;
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, saltRounds, (err, hash) => {
			if(err)
				throw err
		  resolve(hash);
		});
	});
};

// ASYNCHRONOUS VERSION
userSchema.methods.validPassword = (password, user) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, user.local.password, (err, res) => {
			if(err)
				reject(err)

			resolve(res === true);
		});
	});
};

// SYNCHRONOUS VERSION --- NOT RECOMMENDED because because the 
// hashing done by bcrypt is CPU intensive, so the sync version 
// will block the event loop and prevent your application from 
// servicing any other inbound requests or events.

// userSchema.methods.generateHash = (password) => {
// 	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
// };

// userSchema.methods.validPassword = (password) => {
// 	return bcrypt.compareSync(password, this.local.password);
// };

const User = mongoose.model('User', userSchema);
const Token = mongoose.model('Token', tokenSchema);
const Models = {User: User, Token: Token};

module.exports = Models;










