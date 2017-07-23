let LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');

module.exports = function(passport) {

	// serializing a user is used to save in session storage in the website
	// deserailzing brings back an entire user from the id or username

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// nodeJS process.nextTick causes this section to only execute after everything else is done
		process.nextTick(function() {
			User.findOne({'local.email': email}, function(err, user) {
				if(err) {
					return done(err);
				}
				if(user) {
					// null for no error; false so that passport doesn't create a new user; 
					return done(null, false, req.flash('signUpMessage', 'That email is already taken.'));
				} else {

					let newUser = new User();
					newUser.local.email = email;
					newUser.local.password = password;

					newUser.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			});
		});
	}
	));



}