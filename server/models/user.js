const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	}
});

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


module.exports = mongoose.model('User', userSchema);