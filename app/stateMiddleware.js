'use strict';

var session = require('cookie-session');
var tokenUtils = require('./tokenUtils');

// Generate one-time token to track state
function genState(req, res, next) {
  req.session.state = tokenUtils.generateOTP();
  next();
}


// Verify state from session (prevents CSRF here)
function verifyState(req, res, next) {
  if (req.session.state && req.session.state === req.query.state) {
    next();
  } else {
    var err = new Error('Invalid State Param');
    err.status = 401;
    next(err);
  }
}

module.exports = {
  generate: genState,
  verify: verifyState,
  init: function (app) {
    // Use a short-lived (and signed) cookie session to hold the state value.
    // Age is in ms. Needs to be long enough to handle a possible login and authorize scenario (something like 30 seconds)
    app.use(session({secret: tokenUtils.generateOTP(), maxAge: 30000}));
  }
};