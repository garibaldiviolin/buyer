'use strict';

module.exports = {
  env: 'development',
  db: 'mongodb://localhost:27017/Tododb',
  port: process.env.PORT || 1234,
  jwtSecret: "MyS3cr3tK3Y",
  jwtSession: {session: false},
};
