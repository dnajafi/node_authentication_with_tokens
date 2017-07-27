const User = require('../models/user');

module.exports = (app, passport) => {
	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	app.get('/login', (req, res) => {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', (req, res) => {
		res.render('signup.ejs', { message: req.flash('signUpMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true // must set to true in order to flash a message above in failure to signup
	}));

	// isLoggedIn is middleware defined below
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.ejs', { user: req.user });
	});

	app.get('/logout', (req, res) => {
		req.logout(); //passport adds this function to express
		res.redirect('/');
	});

	/*
		*Browsers will by default try to request /favicon.ico from the root of a hostname, in order to show an icon in the browser tab.
		*This catches the favicon.ico request and sends a 204 No Content status.
	*/
	app.get('/favicon.ico', (req, res) => {
		res.status(204);
	});


	// Facebook auth routes
	// Redirect the user to Facebook for authentication.  When complete,
	// Facebook will redirect the user back to the application at
	// /auth/facebook/callback
	// add {scope: ['email']} in order to access facebook user's email
	app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

	// Facebook will redirect the user to this URL after approval.  Finish the
	// authentication process by attempting to obtain an access token.  If
	// access was granted, the user will be logged in.  Otherwise,
	// authentication has failed.
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' }));

	// add {scope: ['profile', 'email']} in order to access google user's profile and email
	app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

	app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/' }));


	app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));
	app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

	app.get('/connect/local', (req, res) => {
		res.render('connect-local.ejs', { message: req.flash('signUpMessage') });
	});

	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/connect/local',
		failureFlash: true
	}));


	// remove facebook token in user profile
	app.get('/unlink/facebook', (req, res) => {
		let user = req.user;

		user.facebook.token = null;
		user.save((err) => {
			if(err)
				throw err;
			res.redirect('/profile');
		});

	});

	// delete local account data if user wants to unlink
	app.get('/unlink/local', (req, res) => {

		let user = req.user;

		user.local.password = null;
		user.local.email = null;

		user.save((err) => {
			if(err)
				throw err

			res.redirect('/profile');
		});
		
	});


	// remove googe token in user profile
	app.get('/unlink/google', (req, res) => {
		let user = req.user;

		user.google.token = null;

		user.save((err) => {
			if(err)
				throw err
			res.redirect('/profile');
		});
	});

}

function isLoggedIn(req, res, next) {
	// if session has been authenticated, return next (which means to continue) 
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}


