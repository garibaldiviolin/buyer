'use strict';

var app = require('../app'),
  chai = require('chai'),
  request = require('supertest'),
  Product = require('../models/product'),
  test = require('../config/test');

var expect = chai.expect;
describe('API Tests', function() {
  var product = {
    "name": "OK",
    "price": 10
  };
  describe('## Create product ', function() {
    it('should create a product', function(done) {
      request(app) .post('/products/create') .send(product) .end(function(err, res) {
        expect(res.statusCode).to.equal(201);
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

    it('should NOT create a product', function(done) {
      request(app) .post('/products/create') .send() .end(function(err, res) {
        expect(res.statusCode).to.equal(500);
        done();
      });
    });
  });

  describe('## Get product ', function() {
    it('should get a product', function(done) {
      var product = new Product(
        {
            name: "Get product",
            price: 100.49
        }
      );

      product
        .save()
        .then(doc => {
          request(app) .get('/products/' + doc._id) .send() .end(function(err, res) {
            expect(res.statusCode).to.equal(200);
            expect(doc._id.toString()).to.equal(res.body._id);
            expect("Get product").to.equal(res.body.name);
            expect(100.49).to.equal(res.body.price);
            done();
          });
        })
        .catch(err => {
            done(err);
        });
    });

    it('should NOT get a product', function(done) {
      request(app) .get('/products/INVALID_ID') .send() .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });

  describe('## List products ', function() {
    it('should NOT return any product', function(done) {
      request(app) .get('/products/list') .send() .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect([]).to.deep.equal(res.body);
        done();
      });
    });
  });

});
