const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	}
});

module.exports = mongoose.model('User', userSchema);