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

	// isLoggedIn is middleware defined below
	router.get('/profile', (req, res) => {
		res.render('profile.ejs', { user: req.user });
	});

	router.get('/*', (req, res) => {
		res.redirect('/profile');
	});
};