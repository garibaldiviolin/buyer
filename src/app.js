var express = require('express');
var bodyParser = require('body-parser');

var product = require('./routes/product'); // Imports routes for the products
var user = require('./routes/user'); // Imports routes for the users
var auth = require('./routes/auth');
var app = express();
var config = require('./config/index');

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://localhost:27017/buyer';
var mongoDB = config.db || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);
app.use('/users', user);
app.use('/auth', auth);

var port = config.port || 1234;

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
});

module.exports = app;
