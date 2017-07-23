let express = require('express');
let app = express();
let port = process.env.PORT || 8080;

let cookieParser = require('cookie-parser');
let session = require('express-session');
let morgan = require('morgan');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let path = require('path');

let configDB = require('./config/database.js');
mongoose.connect(configDB.url)

/* Middlewares */
app.use(morgan('dev')); // middleware for logging
app.use(cookieParser());// parse every cookie in the header and place into req.cookies variable
app.use(bodyParser.urlencoded({extended: true})); // puts form data into a req.body object
// creates req.session variable
app.use(session({secret: 'mysecret', 
	saveUninitialized: true, 
	resave: true})); // saveUninitialized saves unitialized user sessions to db; resave saved user session even if nothings changed


app.set('view engine', 'ejs');// set the view engine/templating engine
app.set('views', path.join(__dirname, '/views')); // manually set where the views are


// app.use('/', function(req, res) {
// 	res.send('Hit express program');
// 	console.log(req.cookies);
// 	console.log('\n*********************************\n');
// 	console.log(req.session);
// });
require('./routes/routes.js')(app);

app.listen(port);
console.log('Server running on port:', port);