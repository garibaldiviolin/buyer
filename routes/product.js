var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("./auth.js")();
var cfg = require("./config.js");
var express = require('express');
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var product_controller = require('../controllers/product');
var user_controller = require("../controllers/users.js");


router.post('/create', product_controller.product_create);

router.get('/list', product_controller.product_list);

router.get('/:id', product_controller.product_details);

router.put('/:id/update', product_controller.product_update);

router.delete('/:id/delete', product_controller.product_delete);

router.post("/token", user_controller.generate_token);

module.exports = router;
