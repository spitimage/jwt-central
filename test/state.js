var request = require('supertest');
var expect = require('chai').expect;
var app = require('../app/app');

describe('Google Auth Endpoint', function(){
  it('Should be redirected at /auth/google', function(done){
    request(app)
      .get('/auth/google')
      .expect('Location', /google/)
      .expect(302, done);
  });
  it('Should receive a new session cookie at /auth/google', function(done){
    request(app)
      .get('/auth/google')
      .expect('Set-Cookie', /express:sess=/)
      .expect(302, done);
  });
  it('Should receive a new signature cookie at /auth/google', function(done){
    request(app)
      .get('/auth/google')
      .expect('Set-Cookie', /express:sess.sig=/)
      .expect(302, done);
  });
  it('Should have a session expiration', function(done){
    request(app)
      .get('/auth/google')
      .end(function(err, res){
        var match = /expires/.test(res.headers['set-cookie']);
        expect(match).to.be.ok();
        done(err);
      });
  });
  it('Should have an httponly session cookie', function(done){
    request(app)
      .get('/auth/google')
      .end(function(err, res){
        var match = /httponly/.test(res.headers['set-cookie']);
        expect(match).to.be.ok();
        done(err);
      });
  });
});

describe('Google Auth Callback Endpoint', function(){
  it('Should redirect to /login with no params', function(done){
    request(app)
      .get('/auth/google/callback')
      .expect('Location', '/login')
      .expect(302, done);
  });
  it('Should redirect to /login with an invalid state param', function(done){
    request(app)
      .get('/auth/google/callback')
      .query({state: 'completenonsense'})
      .expect('Location', '/login')
      .expect(302, done);
  });
  it('Should NOT receive a new session cookie at /auth/google/callback', function(done){
    request(app)
      .get('/auth/google/callback')
      .end(function(err, res){
        expect(res.headers['set-cookie']).not.to.be.ok();
        done(err);
      });
  });
});
