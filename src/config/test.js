'use strict';

var mongoose = require('mongoose');

module.exports = {
  env: 'test',
  db: 'mongodb://localhost:27017/test',
  port: process.env.PORT || 1233,
};

beforeEach(function (done) {
    mongoose.connection.db.dropDatabase(done);
});

//run once after all tests
after(function (done) {
    mongoose.connection.db.dropDatabase(done);
});
