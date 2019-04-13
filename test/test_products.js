'use strict';

var app = require('../app'),
  chai = require('chai'),
  request = require('supertest'),
  Product = require('../models/product');

var expect = chai.expect;
describe('API Tests', function() {
  var product = {
    "name": "OK",
    "price": 10
  };
  describe('## Create product ', function() {
    it('should get a product', function(done) {
      request(app) .post('/products/create') .send(product) .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
        expect(1).to.equal(1);
        const product_query = Product.findById(res.body._id, function (err, object) {
          if (err) {
            return null;
          }
          return object;
        }).then((product) => {
          expect(product.name).to.equal(res.body.name);
          expect(product.price).to.equal(res.body.price);
          done();
        });
      });
    });
  });
});
