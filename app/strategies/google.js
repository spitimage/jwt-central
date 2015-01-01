'use strict';

var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var tokenUtils = require('../tokenUtils');
var generateStateVal = require('../stateMiddleware').generate;
var verifyStateVal = require('../stateMiddleware').verify;
var config = require('../config').google;


module.exports = {
  init: function(app){
    passport.use(new GoogleStrategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/auth/google/callback'
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    ));

    var router = express.Router();
    router.get('/', generateStateVal, function (req, res, next) {
      passport.authenticate('google', {
        failureRedirect: '/login',
        scope: ['profile', 'email'],
        session: false,
        state: req.session.state
      })(req, res, next);
    });

    router.get('/callback', verifyStateVal, passport.authenticate('google', {
      failureRedirect: '/login',
      session: false
    }), function (req, res) {
      // Since google is the email provider here, the email address is most useful
      var token = tokenUtils.generateJWT(req.user.emails[0].value);
      res.json({token: token});
    });

    app.use('/auth/google', router);
  }
};