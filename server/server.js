const express = require('express');
const app = express();
let port = process.env.PORT || 8080;

const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session); // for persistent session storage

const configDB = require('./config/database.js');
mongoose.connect(configDB.url)
require('./config/passport')(passport);

/* Middlewares */
app.use(morgan('dev')); // middleware for logging
app.use(cookieParser());// parse every cookie in the header and place into req.cookies variable
app.use(bodyParser.urlencoded({extended: true})); // puts form data into a req.body object
// creates req.session variable
// saves session data to server's ram memory unless we have a store such as a MongoStore
app.use(session({secret: 'mysecret', 
	saveUninitialized: true, 
	resave: true,
	store: new MongoStore({ mongooseConnection: mongoose.connection,
														ttl: 2 * 24 * 60 * 60 }) // add persistent session storage in our Mongo DB (e.g. session is kept the same even if something happens to the server); ttl is in seconds

	})); // saveUninitialized saves unitialized user sessions to db; resave saved user session even if nothings changed


app.use(passport.initialize());
app.use(passport.session()); // uses the expression (above) to piggyback off of
app.use(flash()); // use to send flash messages from server to client


//Middleware that logs the current session and user
// app.use(function(req, res, next) {
// 	console.log('***********\n');
// 	console.log(req.session);
// 	console.log('\n&&&&&&\n');
// 	console.log(req.user);
// 	console.log('\n***********');
// 	next();
// });

app.set('view engine', 'ejs');// set the view engine/templating engine
app.set('views', path.join(__dirname, '/views')); // manually set where the views are

/********************* ROUTERS **********************/

let auth = express.Router();
require('./routes/auth.js')(auth, passport);
app.use('/auth', auth); // use auth router anytime anybody navigates to our website /auth

let secure = express.Router();
require('./routes/secure.js')(secure, passport);
app.use('/', secure);


// require('./routes/routes.js')(app, passport); // passes passport to routes so they know it exists

app.listen(port);
console.log('Server running on port:', port);

