'use strict';

var mongoose = require('mongoose');

module.exports = {
  env: 'test',
  db: 'mongodb://localhost:27017/TododbTest',
  port: process.env.PORT || 1233,
};

//should we delete the database after the test run?
var deleteAfterRun = false;

//run once before all tests
beforeEach(function (done) {

    //test if database is populated
    /*var User = mongoose.model('User');
    User.count({})
        .then(function (count) {
            if (count === 0) {
                //no content so safe to delete
                deleteAfterRun = true;
                //add test data
                return fixtures.ensureTestData();
            } else {
                console.log('Test database already exists');
            }
        })
        .then(function() {
            done();
        });*/
    done();

});

//run once after all tests
afterEach(function (done) {
    console.log('Deleting test database');
    mongoose.connection.db.dropDatabase(done);
});
