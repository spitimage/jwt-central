var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app/app');

describe('Login Endpoint', function(){
  it('Should send HTML login at /login/', function(done){
    request(app)
      .get('/login/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('Should send 303 from /login to /login/', function(done){
    request(app)
      .get('/login')
      .expect('Location', '/login/')
      .expect(303, done);
  });
  it('Should have a google login link on the page', function(done){
    request(app)
      .get('/login/')
      .end(function(err, res){
        var match = /Login With Google/.test(res.text);
        expect(match).to.be.ok();
        done(err);
      });
  });

});

describe('Key Endpoint', function(){
  it('Should send 200 at /key', function(done){
    request(app)
      .get('/key')
      .expect(200, done);
  });
  it('Should send typical key content at /key', function(done){
    request(app)
      .get('/key')
      .end(function(err, res){
        var match = /-----BEGIN PUBLIC KEY-----/.test(res.text);
        expect(match).to.be.ok();
        match = /-----END PUBLIC KEY-----/.test(res.text);
        expect(match).to.be.ok();
        done(err);
      });
  });

});