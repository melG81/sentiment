// Dependencies
let express = require('express');
let exphbs = require('express-handlebars');
let path = require('path');
let app = express();
let config = require('./config');

// Set view engine
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));
// App
app.get('/', function (req, res, next) {
  res.render('home');
});

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

const PORT = config.PORT;
// Expose and listen
app.listen(PORT, function () {
  console.log(`Listening to port ${PORT}`);
});

module.exports = app;