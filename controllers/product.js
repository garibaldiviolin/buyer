var Product = require('../models/product');

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

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
            console.log(err);
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
        if (err) return next(err);
        res.send(product);
    })
};

exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return next(err);
        res.send(product);
    });
};

exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.status(204).send();
    })
};
