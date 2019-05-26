'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');
var app = require('../app');
var chai = require('chai');
var request = require('supertest');

var expect = chai.expect;

async function dropDatabase() {
    await mongoose.connection.db.dropDatabase();
};

async function createJWTToken(request) {

    var user_json = {
        _id: "5ce499d502b60729218eb6c2",
        username: "test_user",
        password: "test_password"
    }

    var user = new User(
        user_json
        );

    await user
    .save()
    .then()
    .catch(err => {
        throw err;
    });

    var user_copy = JSON.parse(JSON.stringify(user_json));
    delete user_copy._id;
    const res = await request .post('/auth/token') .send(user_copy);
    expect(res.statusCode).to.equal(200);
    user_json.token = res.body.token;
    return user_json;
}

//run once after all tests
after(function (done) {
    mongoose.connection.db.dropDatabase(done);
});

module.exports = {
    env: 'test',
    db: 'mongodb://localhost:27017/test',
    port: process.env.PORT || 1233,
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {session: false},
    createJWTToken: createJWTToken,
    dropDatabase: dropDatabase
};
