'use strict';

var mongoose = require('mongoose');

module.exports = {
  env: 'test',
  db: 'mongodb://localhost:27017/test',
  port: process.env.PORT || 1233,
};

console.log('configurou banco');

//should we delete the database after the test run?
var deleteAfterRun = false;

//run once before all tests
beforeEach(function (done) {
    mongoose.connection.db.dropDatabase(done);
    done();
});

//run once after all tests
afterEach(function (done) {
    mongoose.connection.db.dropDatabase(done);
});
