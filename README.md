# Boilerplate node authenitcation code using tokens.
## Tokens protect designated routes in routes/api.js
### Default token expiration is 60 seconds but can be changed in the token model defined in user.js

#### Allows for local-strategy authentication, facebook oauth authentication, google+ oauth authentication.

#### Be sure to include server/config/database.js for Mongo database configuration in the case of cloning the repo.
##### Example:
```javascript
module.exports = {
	'url': 'URL_TO_MLAB_DB'
}
```

#### Be sure to include server/config/auth.js for other configurations (facebook, google+, etc...) in the case of cloning the repo.
##### Example:
```javascript
module.exports = {
	'facebookAuth': {
		'clientID': 'ADD_THIS',
		'clientSecret': 'ADD_THIS',
		'callbackURL': 'ADD_THIS'
	},
	'googleAuth': {
		'clientID': 'ADD_THIS',
		'clientSecret': 'ADD_THIS',
		'callbackURL': 'ADD_THIS'
	}
}
```

#### Much of this code was built off of Brent Aureli's node tutorial/youtube series. I've integrated some changes such as:
	* async password encryption
	* some ES6 syntax