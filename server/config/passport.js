const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');
const configAuth = require('./auth');

module.exports = (passport) => {
	// serializing a user is used to save in session storage in the website
	// deserailzing brings back an entire user from the id or username
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	(req, email, password, done) => {
		// nodeJS process.nextTick causes this section to execute asynchronously after everything else is done and data has come back
		process.nextTick(() => {
			User.findOne({ 'local.email': email }, (err, user) => {
				if(err)
					return done(err);
				if(user){
					// null for no error; false so that passport doesn't create a new user; 
					return done(null, false, req.flash('signUpMessage', 'That email is already taken.'));
				} 
				if(!req.user) {
					// if no user exists and user is not logged in than this is a brand new authentication and so we want to add them to our db
					let newUser = new User();
					newUser.local.email = email;
	
					newUser.generateHash(password).then((hashedPassword) => {
						newUser.local.password = hashedPassword;
						newUser.save((err) => {
							if(err)
								throw err;
							return done(null, newUser);
						});
					});
				} else {
					// they are logged in and we should merge their local account info into their current profile info in db
					let user = req.user;
					user.local.email = email;

					user.generateHash(password).then((hashedPassword) => {
						user.local.password = hashedPassword;
						user.save((err) => {
							if(err)
								throw err;
							return done(null, user);
						});
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	// for when email and password are correctly sent from client
	(req, email, password, done) => {
		process.nextTick(() => {
			User.findOne({ 'local.email': email }, (err, user) => {
				if(err)
					return done(err);
				
				// not an error but is a failed user lookup/attempt at logging in
				if(!user)
					return done(null, false, req.flash('loginMessage', 'No user found with that email.'));

				user.validPassword(password, user).then((response) => {
					if(response)
						return done(null, user);
					else
						return done(null, false, req.flash('loginMessage', 'Invalid email or password.'));
				});
			});
		});
	}));

	passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'emails', 'name'],
    passReqToCallback: true
  },
  (request, accessToken, refreshToken, profile, done) => {
    process.nextTick( () => {

    	// user is not logged in yet
    	if(!request.user) {
    		User.findOne({ 'facebook.id': profile.id }, (err, user) => {
	    		if(err)
	    			return done(err);
	    		if(user) {
	    			return done(null, user);
	    		}
	    		else {
	    			// user does not exist; make a new user
	    			let newUser = new User();

	    			newUser.facebook.id = profile.id;
	    			newUser.facebook.token = accessToken;
	    			newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    			newUser.facebook.email = profile.emails[0].value;

	    			newUser.save((err) => {
	    				if(err)
	    					throw err;
	    				return done(null, newUser);
	    			});
	    		}
	    	});

    	}
    	// user is logged in already and needs their facebook info to be merged into user's current profile in db
    	else {
    		let user = request.user;

    		user.facebook.id = profile.id;
    		user.facebook.token = accessToken;
	    	user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    	user.facebook.email = profile.emails[0].value;

	    	user.save((err) => {
  				if(err)
  					throw err;
  				return done(null, user);
  			});
    	}
    });
  }));

  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
    passReqToCallback : true
  },
  (request, accessToken, refreshToken, profile, done) => {
  	process.nextTick( () => {

  		// user is not logged in yet
  		if(!request.user) {

  			User.findOne({ 'google.id': profile.id }, (err, user) => {
	    		if(err)
	    			return done(err);
	    		if(user) {
	    			return done(null, user);
	    		}
	    		else {
	    			// user does not exist; make a new user
	    			let newUser = new User();

	    			newUser.google.id = profile.id;
	    			newUser.google.token = accessToken;
	    			newUser.google.name = profile.displayName;
	    			newUser.google.email = profile.emails[0].value;

	    			newUser.save((err) => {
	    				if(err)
	    					throw err;
	    				return done(null, newUser);
	    			});
	    		}
	    	});

  		} 
  		// user is logged in already and needs their facebook info to be merged into user's current profile in db
  		else {
  			let user = request.user;

    		user.google.id = profile.id;
  			user.google.token = accessToken;
  			user.google.name = profile.displayName;
  			user.google.email = profile.emails[0].value;

	    	user.save((err) => {
  				if(err)
  					throw err;
  				return done(null, user);
  			});
    	}
    });
  }));



}




