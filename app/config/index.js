'use strict';

var path = require('path');
var _ = require('lodash');

var all = {
  // Root path of server
  root: path.normalize(__dirname + '/..'),

  server: {
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT || 8000
  },

  // JWT audience
  audience: 'default',

  google: {
    clientID: process.env.GOOGLE_ID || 'google',
    clientSecret: process.env.GOOGLE_SECRET || 'googleSecret'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'github',
    clientSecret: process.env.GITHUB_SECRET || 'githubSecret'
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});