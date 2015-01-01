'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var morgan = require('morgan');
var config = require('./config');

app.use(morgan('dev'));
app.use(require('passport').initialize());

// Initialize the state middleware
require('./stateMiddleware').init(app);

// Initialize all auth strategies here
require('./strategies/google').init(app);
require('./strategies/github').init(app);

// Serve up the login page and related static assets at /login
app.use('/login', express.static(__dirname + '/public'));

// This endpoint responds with the public signing key
app.get('/key', function (req, res, next) {
  var keyfile = config.root + '/' + config.keydir + '/rsa-public.pem';
  res.sendFile(keyfile, function (err) {
    if (err) {
      next(err);
    }
  });
});

app.use(function (err, req, res, next) {
  // Send all 401 responses back to the login page
  if (err && err.status === 401) {
    res.redirect('/login');
  } else {
    next(err);
  }
});


// Start server
server.listen(config.server.port, config.server.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.server.port, app.get('env'));
});

// Expose app
module.exports = app;