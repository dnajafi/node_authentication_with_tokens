Boilerplate node authenitcation code without using tokens.

Be sure to include server/config/database.js for database configuration in the case of cloning the repo.
Example:
module.exports = {
	'url': 'route to your mlab database'
}

Be sure to include server/config/auth.js for other configurations (facebook, google+, etc...) in the case of cloning the repo.
Example:
module.exports = {
	'facebook': {
		'clientID': '',
		'clientSecret': '',
		'callbackURL': ''
	}
}


Much of this code was built off of Brent Aureli's node tutorial/youtube series. I've integrated some changes such as:
	* async password encryption
	* some ES6 syntax  