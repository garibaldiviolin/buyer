var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var cfg = require("../config/development.js");
var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/user');


router.post('/create', user_controller.user_create);

router.get('/list', user_controller.user_list);

router.get('/:id', user_controller.user_details);

router.put('/:id/update', user_controller.user_update);

router.delete('/:id/delete', user_controller.user_delete);

module.exports = router;
