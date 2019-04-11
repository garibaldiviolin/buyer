'use strict';

module.exports = {
  env: 'production',
  db: process.env.MONGOHQ_URL || process.env.MONGODB_URI,
  port: process.env.PORT || 1234,
};
