'use strict';

var app = require('../app'),
chai = require('chai'),
request = require('supertest'),
User = require('../models/user'),
User = require('../models/user'),
test = require('../config/test'),
mongoose = require('mongoose');

var expect = chai.expect;

const create_token = async function(done) {

    await mongoose.connect(test.db, function(){
        mongoose.connection.db.dropDatabase(function(){
        })
    });
    done();
}


describe('User Tests', function() {
    before((done) => {
        create_token(done);
    });

    var user = {
        "username": "test_user",
        "password": "test_pass"
    };

    // Create Users (POST) endpoint
    describe('## Create user ', function() {
        it('should create a user', function(done) {
            request(app) .post('/users/create') .send(user) .end(function(err, res) {
                expect(res.statusCode).to.equal(201);
                const user_query = User.findById(res.body._id, function (err, object) {
                    if (err) {
                        return null;
                    }
                    return object;
                }).then((user) => {
                    expect(user.name).to.equal(res.body.name);
                    expect(user.price).to.equal(res.body.price);
                    done();
                });
            });
        });

        it('should NOT create a user', function(done) {
            request(app) .post('/users/create') .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(500);
                done();
            });
        });
    });

    // List Users (GET) endpoint
    describe('## List users ', function() {
        it('should NOT return any user', function(done) {
            request(app) .get('/users/list') .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect([]).to.deep.equal(res.body);
                done();
            });
        });

        it('should return users', function(done) {
            const array = [
            {username: "Jelly", password: "asd321"},
            {username: "John", password: "oiuoiu321"}
            ];
            User.insertMany(array)
            .then(function (docs) {
                request(app) .get('/users/list') .send() .end(function(err, res) {
                    var usersList = [];

                    docs.forEach(function(user) {
                        usersList.push({
                            _id: user._id.toString(),
                            username: user.username
                        });
                    });

                    expect(res.statusCode).to.equal(200);
                    expect(usersList).to.deep.equal(res.body);
                    done();
                });
            })
            .catch(function (err) {
                done(err);
            });
        });
    });

});
