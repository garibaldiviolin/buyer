var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("../controllers/auth.js")();
var cfg = require("../config/production.js");
var express = require('express');
var router = express.Router();

var User = require('../models/user');

// Require the controllers WHICH WE DID NOT CREATE YET!!
var user_controller = require("../controllers/auth");

router.post('/token', function(req, res) {
    console.log(req.body.email);
    console.log(req.body.password);
    if (req.body.email && req.body.password) {
        console.log('Aqui');
        var email = req.body.email;
        var password = req.body.password;

        var query = User.findOne({"email": email, "password": password}).then(function (user) {
            console.log("user"+user);
            if (user && user.password == password) {
                var payload = {id: user._id};
                var token = jwt.encode(payload, cfg.jwtSecret);
                res.json({token: token});
            } else {
                console.log("saiu aqui");
                res.sendStatus(401);
            }
        });
    }
    else {
        console.log("saiu 2");
        res.sendStatus(401);
    }
});

module.exports = router;
