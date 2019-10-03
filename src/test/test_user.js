'use strict';

var app = require('../app'),
  chai = require('chai'),
  request = require('supertest'),
  User = require('../models/user'),
  test = require('../config/test'),
  mongoose = require('mongoose');

var expect = chai.expect;

var user_json = {};

describe('User Tests', function() {
  beforeEach(async function() {
    await test.dropDatabase();
  });

  var user = {
    username: 'test_user',
    password: 'test_pass',
  };

  // Create Users (POST) endpoint
  describe('## Create user ', function() {
    it('should create a user', function(done) {
      request(app)
        .post('/users/create')
        .send(user)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(201);
          const user_query = User.findById(res.body._id, function(err, object) {
            if (err) done(err);
            return object;
          }).then(user => {
            expect(user.username).to.equal(res.body.username);
            //expect(user.password).to.equal(res.body.password);
            done();
          });
        });
    });

    it('should NOT create a user', function(done) {
      request(app)
        .post('/users/create')
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(500);
          done();
        });
    });
  });

  // Detail Single User (GET) endpoint
  describe('## Get user ', function() {
    it('should get a user', function(done) {
      var user = new User({
        username: 'Get user',
        password: 'get_password',
      });

      user
        .save()
        .then(doc => {
          request(app)
            .get('/users/' + doc._id)
            .send()
            .end(function(err, res) {
              expect(res.statusCode).to.equal(200);
              expect(doc._id.toString()).to.equal(res.body._id);
              expect('Get user').to.equal(res.body.username);
              done();
            });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT get a user', function(done) {
      request(app)
        .get('/users/INVALID_ID')
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });

  // List Users (GET) endpoint
  describe('## List users ', function() {
    it('should NOT return any user', function(done) {
      request(app)
        .get('/users/list')
        .send()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect([]).to.deep.equal(res.body);
          done();
        });
    });

    it('should return users', function(done) {
      const array = [
        {username: 'Jelly', password: '!jelly321'},
        {username: 'John', password: '#okl321'},
      ];
      User.insertMany(array)
        .then(function(docs) {
          request(app)
            .get('/users/list')
            .send()
            .end(function(err, res) {
              var usersList = [];

              docs.forEach(function(user) {
                usersList.push({
                  _id: user._id.toString(),
                  username: user.username,
                });
              });

              expect(res.statusCode).to.equal(200);
              expect(usersList).to.deep.equal(res.body);
              done();
            });
        })
        .catch(function(err) {
          done(err);
        });
    });
  });

  // Update user (PUT) endpoint
  describe('## Update user ', function() {
    it('should update a user', function(done) {
      var user = new User({
        username: 'Old username',
        password: '$old_password',
      });

      const new_values = {
        username: 'New username',
        password: ')new_password',
      };

      user
        .save()
        .then(doc => {
          request(app)
            .put('/users/' + doc._id.toString() + '/update')
            .send(new_values)
            .end(function(err, res) {
              var usersList = {
                _id: doc._id.toString(),
                username: 'New username',
              };

              expect(res.statusCode).to.equal(200);
              expect(usersList).to.deep.equal(res.body);

              const user_query = User.findById(doc._id, function(err, object) {
                if (err) done(err);
              }).then(updated_user => {
                expect(updated_user._id.toString()).to.equal(
                  res.body._id.toString()
                );
                expect(updated_user.username).to.equal(res.body.username);
                done();
              });
            });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT update a user', function(done) {
      var user = new User({
        username: 'Old username',
        password: 'old_password',
      });

      // Invalid
      const new_values = {};

      user
        .save()
        .then(doc => {
          request(app)
            .put('/users/' + doc._id.toString() + '/update')
            .send(new_values)
            .end(function(err, res) {
              expect(res.statusCode).to.equal(400);
              done();
            });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT find or update a user', function(done) {
      const new_values = {
        username: 'New username',
        password: 'new_password',
      };

      request(app)
        .put('/users/INVALID_ID/update')
        .send(new_values)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.deep.equal({error: 'not found'});
          done();
        });
    });
  });

  // Delete user (DELETE) endpoint
  describe('## Delete user ', function() {
    it('should delete a user', function(done) {
      var user = new User({
        username: 'deleting user',
        password: 'deleted_password',
      });

      user
        .save()
        .then(doc => {
          request(app)
            .delete('/users/' + doc._id.toString() + '/delete')
            .send()
            .end(function(err, res) {
              expect(res.statusCode).to.equal(204);
              expect({}).to.deep.equal(res.body);

              const user_query = User.findById(doc._id, function(err, object) {
                if (err) done(err);
              })
                .then(deleted_user => {
                  if (!deleted_user) return done();
                  done('User still exists!');
                })
                .catch(err => {
                  done();
                });
            });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT delete a user', function(done) {
      const new_values = {
        username: 'New username',
        password: 'new_password',
      };

      request(app)
        .put('/users/INVALID_ID/delete')
        .send(new_values)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });
});
