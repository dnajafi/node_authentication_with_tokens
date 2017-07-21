let mongoose = require('mongoose');

let userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	}
});

module.exports = mongoose.model('User', userSchema);