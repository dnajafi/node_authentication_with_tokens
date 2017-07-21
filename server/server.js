let express = require('express');
let app = express();
let port = process.env.PORT || 8080;

let cookieParser = require('cookie-parser');
let session = require('express-session');

let morgan = require('morgan');

/* Middlewares */
app.use(morgan('dev')); // middleware for logging
app.use(cookieParser());// parse every cookie in the header and place into req.cookies variable
// creates req.session variable
app.use(session({secret: 'mysecret', 
	saveUninitialized: true, 
	resave: true})); // saveUninitialized saves unitialized user sessions to db; resave saves user session even if nothings changed

app.use('/', function(req, res) {
	res.send('Hit express program');
	console.log(req.cookies);
	console.log('\n*********************************\n');
	console.log(req.session);
});

app.listen(port);
console.log('Server running on port:', port);