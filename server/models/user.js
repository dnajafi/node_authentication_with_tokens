let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	}
});

module.exports = mongoose.model('User', userSchema);