let User = require('../models/user');

module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/signup', function(req, res) {

		res.render('signup.ejs', { message: req.flash('signUpMessage') });

	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true // must set to true in order to flash a message above in failure to signup
	}));


	app.get('/:username/:password', function(req, res) {

		let newUser = new User();

		newUser.local.username = req.params.username;
		newUser.local.password = req.params.password;

		console.log(newUser.local.username);
		console.log(newUser.local.password);

		newUser.save(function(err) {
			if(err) {
				throw err;
			}
		});

		res.send("Success");
	});

}