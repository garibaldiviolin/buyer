'use strict';

var app = require('../app'),
chai = require('chai'),
request = require('supertest'),
Product = require('../models/product'),
User = require('../models/user'),
test = require('../config/test'),
mongoose = require('mongoose');

var expect = chai.expect;

var token;

var user_json = {
    _id: "5ce499d502b60729218eb6c2",
    username: "test_user",
    password: "test_password"
}

const create_token = async function() {

    var user = new User(
        user_json
        );

    await user
    .save()
    .then()
    .catch(err => {
        throw err;
    });

    console.log('passou');

    const res = await request(app) .post('/auth/token') .send(user_json);
    expect(res.statusCode).to.equal(200);
    token = res.body.token;
}


describe('JWT Authentication Tests', function() {

    before((done) => {
        mongoose.connect(test.db, function(){
            mongoose.connection.db.dropDatabase(function(){
                done();
            })
        })

        create_token();
    });

    // Generate JWT token (POST) endpoint
    describe('## Generate new token ', function() {
        it('should create a token', function(done) {
            request(app) .post('/auth/token') .send(user_json) .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.deep.equal({
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciO" +
                             "iJIUzI1NiJ9.eyJpZCI6IjVjZ" +
                             "TQ5OWQ1MDJiNjA3MjkyMThlYj" +
                             "ZjMiJ9.J3elAubvxyaXoZDgla" +
                             "2vSIBUGSUOU8LuPrWHOsQmIKk"
                });
                done();
            });
        });
    });

    // Test Authentication with valid token
    describe('## Authenticate with valid token ', function() {
        it('should accept token', function(done) {
            request(app) .get('/products/list') .set('Authorization', 'Bearer ' + token) .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect([]).to.deep.equal(res.body);
                done();
            });
        });
    });

});