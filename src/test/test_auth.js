'use strict';

var app = require('../app'),
chai = require('chai'),
request = require('supertest'),
Product = require('../models/product'),
User = require('../models/user'),
test = require('../config/test'),
mongoose = require('mongoose');

var expect = chai.expect;

let user_json = {'s': 's'};
var token;

describe('JWT Authentication Tests', function() {

    beforeEach(async function() {
        await test.dropDatabase();
        user_json = await test.createJWTToken(request(app));
        token = await user_json.token;
    });

    // Generate JWT token (POST) endpoint
    describe('## Generate new token ', function() {
        it('should create a token', function(done) {
            request(app) .post('/auth/token') .send(user_json) .end(function(err, res) {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.have.property("token");
                const returned_token = res.body.token;
                expect(res.body).to.deep.equal({token: returned_token});
                done();
            });
        });
    });

    // Test generation of JWT token (POST) endpoint using invalid username
    describe('## Generate new token with invalid username ', function() {
        it('should NOT create a token', function(done) {
            var user_copy = JSON.parse(JSON.stringify(user_json));
            user_copy.username = 'test';
            request(app) .post('/auth/token') .send(user_copy) .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

    // Test generation of JWT token (POST) endpoint using invalid password
    describe('## Generate new token with invalid password ', function() {
        it('should NOT create a token', function(done) {
            var user_copy = JSON.parse(JSON.stringify(user_json));
            user_copy.password = 'yyyy';
            request(app) .post('/auth/token') .send(user_copy) .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

    // Test generation of JWT token (POST) endpoint without username
    describe('## Generate new token without username ', function() {
        it('should NOT create a token', function(done) {
            var user_copy = JSON.parse(JSON.stringify(user_json));
            delete user_copy.username;
            request(app) .post('/auth/token') .send(user_copy) .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

    // Test generation of JWT token (POST) endpoint without password
    describe('## Generate new token without password ', function() {
        it('should NOT create a token', function(done) {
            var user_copy = JSON.parse(JSON.stringify(user_json));
            delete user_copy.password;
            request(app) .post('/auth/token') .send(user_copy) .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
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

    // Test Authentication with invalid token
    describe('## Authenticate with invalid token ', function() {
        it('should NOT accept token', function(done) {
            request(app) .get('/products/list') .set('Authorization', 'Bearer ' + "AAA") .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

    // Test Authentication using token without id
    describe('## Authenticate using token without id ', function() {
        it('should NOT accept token', function(done) {
            const token_without_id = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1N" +
                                     "iJ9.eyJpbnZhbGlkIjoiNWNlYjE3ZmUzN" +
                                     "jljM2YyMTM4ZDEzODM0In0.C8nxwC-bRf" +
                                     "GOjjeruhTZpl1kLoQWn1EdRUhxVHvB20g"
            request(app) .get('/products/list') .set('Authorization', 'Bearer ' + token_without_id) .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

    // Test Authentication using token with invalid id ("id": "ZZZ")
    describe('## Authenticate using token with invalid id ', function() {
        it('should NOT accept token', function(done) {
            const invalid_id_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1" +
                                     "NiJ9.eyJpZCI6IlpaWiJ9.d5Y5opaIDx" +
                                     "VLmIrDMtN86sdM8dNm8UCqV7Z0roedwi4"
            request(app) .get('/products/list') .set('Authorization', 'Bearer ' + invalid_id_token) .send() .end(function(err, res) {
                expect(res.statusCode).to.equal(401);
                expect(res.body).to.deep.equal({});
                done();
            });
        });
    });

});