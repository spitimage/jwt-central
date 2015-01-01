'use strict';

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var config = require('./config');
var keyfile = config.root + '/' + config.keydir + '/rsa-private.pem';
var secret = fs.readFileSync(keyfile);  // get private key

// Synchronous utilities related to tokens
module.exports = {
  generateOTP: function(){
    return crypto.randomBytes(16).toString('hex');
  },
  generateJWT: function(subject){
    var data = {
      sub: subject,
      aud: config.audience
    };
    return jwt.sign(data, secret, { algorithm: 'RS256', expiresInMinutes: config.jwt.timeoutMinutes});
  }
};