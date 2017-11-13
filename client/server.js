require('dotenv').config();

// Dependencies
let express = require('express');
var bodyParser = require('body-parser');
let exphbs = require('express-handlebars');
let path = require('path');
let cookieParser = require('cookie-parser');

let app = express();
let compression = require('compression');
let config = require('./config');
let helpers = require('./src/helpers');

let schedule = require('./src/schedule')

// Run API polling schedule on start
schedule.connect()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Use session and cookie parser
app.use(cookieParser());

// Set view engine
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers,
  partialsDir: __dirname + '/components/'
}));
app.set('view engine', '.hbs');
// Set as default true in production
// app.set('view cache', true)

// GZIP all assets
app.use(compression());


// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/index'));

// Catch and send error messages
app.use(function (err, req, res, next) {
  if (err) {
    res.status(422).json({
      error: err.message
    });
  } else {
    next();
  }
});

// 404
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist'
  });
});

const PORT = config.PORT || 4000;
// Expose and listen
app.listen(PORT, function () {
  console.log(`Listening to port ${PORT}`);
});

module.exports = app;