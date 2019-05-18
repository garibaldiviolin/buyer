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

  // Create Products (POST) endpoint
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

  // Detail Single Product (GET) endpoint
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

  // List Products (GET) endpoint
  describe('## List products ', function() {
    it('should NOT return any product', function(done) {
      request(app) .get('/products/list') .send() .end(function(err, res) {
        expect(res.statusCode).to.equal(200);
        expect([]).to.deep.equal(res.body);
        done();
      });
    });

    it('should return products', function(done) {
      const array = [
        {name: "Jelly", price: 47.21},
        {name: "John", price: 32.41}
      ];
      Product.insertMany(array)
        .then(function (docs) {
          request(app) .get('/products/list') .send() .end(function(err, res) {
            var productsList = [];

            docs.forEach(function(product) {
                productsList.push({
                  _id: product._id.toString(),
                  name: product.name,
                  price: product.price
                });
            });

            expect(res.statusCode).to.equal(200);
            expect(productsList).to.deep.equal(res.body);
            done();
          });
        })
        .catch(function (err) {
          done(err);
        });
    });
  });

  // Update product (PUT) endpoint
  describe('## Update product ', function() {
    it('should update a product', function(done) {
      var product = new Product(
        {
            name: "Old name",
            price: 100.49
        }
      );

      const new_values = {
        name: "New name",
        price: 45.42
      }

      product
        .save()
        .then(doc => {
          request(app) .put('/products/' + doc._id.toString() + '/update') .send(new_values) .end(function(err, res) {
            var productsList = {
              _id: doc._id.toString(),
              name: "New name",
              price: 45.42
            };

            expect(res.statusCode).to.equal(200);
            expect(productsList).to.deep.equal(res.body);

            const product_query = Product.findById(doc._id, function (err, object) {
              if (err) done(err);
            }).then((updated_product) => {
              expect(updated_product._id.toString()).to.equal(res.body._id.toString());
              expect(updated_product.name).to.equal(res.body.name);
              expect(updated_product.price).to.equal(res.body.price);
              done();
            });
          });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT update a product', function(done) {
      var product = new Product(
        {
            name: "Old name",
            price: 100.49
        }
      );

      // Invalid
      const new_values = {}

      product
        .save()
        .then(doc => {
          request(app) .put('/products/' + doc._id.toString() + '/update') .send(new_values) .end(function(err, res) {
            expect(res.statusCode).to.equal(400);
            done();
          });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT find or update a product', function(done) {
      const new_values = {
        name: "New name",
        price: 45.42
      }

      request(app) .put('/products/INVALID_ID/update') .send(new_values) .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.deep.equal({ error: 'not found'});
        done();
      });
    });

  });

  // Delete product (DELETE) endpoint
  describe('## Delete product ', function() {
    it('should delete a product', function(done) {
      var product = new Product(
        {
            name: "deleting product",
            price: 100.49
        }
      );

      product
        .save()
        .then(doc => {
          request(app) .delete('/products/' + doc._id.toString() + '/delete') .send() .end(function(err, res) {
            expect(res.statusCode).to.equal(204);
            expect({}).to.deep.equal(res.body);

            const product_query = Product.findById(doc._id, function (err, object) {
              if (err) done(err);
            }).then((deleted_product) => {
              if (!deleted_product) return done();
              done('Product still exists!');
            }).catch(err => {
              done();
            });
          });
        })
        .catch(err => {
          done(err);
        });
    });

    it('should NOT delete a product', function(done) {
      const new_values = {
        name: "New name",
        price: 45.42
      }

      request(app) .put('/products/INVALID_ID/delete') .send(new_values) .end(function(err, res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });

});
