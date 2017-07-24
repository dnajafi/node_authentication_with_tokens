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

	app.get('/:username/:password', (req, res) => {

		let newUser = new User();

		newUser.local.username = req.params.username;
		newUser.local.password = req.params.password;

		console.log(newUser.local.username);
		console.log(newUser.local.password);

		newUser.save((err) => {
			if(err) {
				throw err;
			}
		});

		res.send("Success");
	});
};


function isLoggedIn(req, res, next) {
	// if session has been authenticated, return next (which means to continue) 
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}



