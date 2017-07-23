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

const configDB = require('./config/database.js');
mongoose.connect(configDB.url)
require('./config/passport')(passport);

/* Middlewares */
app.use(morgan('dev')); // middleware for logging
app.use(cookieParser());// parse every cookie in the header and place into req.cookies variable
app.use(bodyParser.urlencoded({extended: true})); // puts form data into a req.body object
// creates req.session variable
app.use(session({secret: 'mysecret', 
	saveUninitialized: true, 
	resave: true})); // saveUninitialized saves unitialized user sessions to db; resave saved user session even if nothings changed


app.use(passport.initialize());
app.use(passport.session()); // uses the expression (above) to piggyback off of
app.use(flash()); // use to send flash messages from server to client

app.set('view engine', 'ejs');// set the view engine/templating engine
app.set('views', path.join(__dirname, '/views')); // manually set where the views are


// app.use('/', function(req, res) {
// 	res.send('Hit express program');
// 	console.log(req.cookies);
// 	console.log('\n*********************************\n');
// 	console.log(req.session);
// });
require('./routes/routes.js')(app, passport); // passes passport to routes so they know it exists

app.listen(port);
console.log('Server running on port:', port);






















