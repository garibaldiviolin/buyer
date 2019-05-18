var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("../controllers/auth.js")();
var cfg = require("../config/development.js");
var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/product');


router.post('/create', product_controller.product_create);

router.get('/list', auth.authenticate(), product_controller.product_list);

router.get('/:id', product_controller.product_details);

router.put('/:id/update', product_controller.product_update);

router.delete('/:id/delete', product_controller.product_delete);

module.exports = router;
