var Product = require('../models/product');

exports.product_create = function (req, res) {
    var product = new Product(
        {
            name: req.body.name,
            price: req.body.price
        }
    );

    product
        .save()
        .then(doc => {
            res.status(201).send(doc.toJSON());
        })
        .catch(err => {
            res.status(500).send({ error: err });
        });
};

exports.product_list = function (req, res) {
    Product.find({}, function(err, products) {
        var productsList = [];

        products.forEach(function(product) {
            productsList.push(product);
        });

        res.json(productsList);  
    });
};

exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            res.status(404).send({ error: err });
            return;
        }
        res.send(product);
    })
};

exports.product_update = function (req, res) {
    Product.findOneAndReplace(req.params.id, {$set: req.body}, function (err, product) {
    }).then((product) => {
        if (!product) return res.status(404).send({error: "not found"});
        return res.send(product);
    }).catch(err => {
        return res.status(400).send({ error: err });
    });
};

exports.product_delete = function (req, res) {
    Product.findOneAndDelete(req.params.id, function (err, car) {
        res.status(204).send();
    })
};
