const User = require('../models/user').User;
const Token = require('../models/user').Token;

module.exports = (router, passport) => {
	// secure routes for pages we only want users to be able to see if they are logged into the web app
	// middleware for the router
	router.use((req, res, next) => {
		// if session has been authenticated, return next (which means to continue) 
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/auth'); // takes them to index page for our auth router
	});

	router.get('/profile', (req, res) => {
		User.findOne({ _id: req.user._id }).populate('token').exec(function(err, user){
			res.render('profile.ejs', { user: user });
		});
	});

	router.get('/getToken', (req, res) => {
		User.findOne({ _id: req.user._id }).populate('token').exec((err, user) => {
			if(user.token === null)
				user.generateToken();
			res.redirect('/profile');
			// res.redirect('/testToken');

		});
	});

	router.get('/testToken', (req, res) => {
		User.findOne({ _id: req.user._id }).populate('token').exec((err, user) => {
			res.json(user);
		});
	});

	router.get('/*', (req, res) => {
		res.redirect('/profile');
	});
};