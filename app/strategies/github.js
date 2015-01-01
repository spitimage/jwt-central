'use strict';

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
var tokenUtils = require('../tokenUtils');
var generateStateVal = require('../stateMiddleware').generate;
var verifyStateVal = require('../stateMiddleware').verify;
var config = require('../config').github;


module.exports = {
  init: function(app){
    passport.use(new Strategy({
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: '/auth/github/callback'
      },
      function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
      }
    ));

    var router = express.Router();
    router.get('/', generateStateVal, function (req, res, next) {
      passport.authenticate('github', {
        failureRedirect: '/login',
        scope: ['profile', 'email'],
        session: false,
        state: req.session.state
      })(req, res, next);
    });

    router.get('/callback', verifyStateVal, passport.authenticate('github', {
      failureRedirect: '/login',
      session: false
    }), function (req, res) {
      // Use the github user profile for the subject field
      var token = tokenUtils.generateJWT(req.user.profileUrl);
      res.json({token: token});
    });

    app.use('/auth/github', router);
  }
};