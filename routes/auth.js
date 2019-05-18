var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("../controllers/auth.js")();
var cfg = require("../config/production.js");
var express = require('express');
var router = express.Router();

var User = require('../models/user');

var user_controller = require("../controllers/auth");

router.post('/token', function(req, res) {
    console.log(req.body.username);
    console.log(req.body.password);
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;

        var query = User.findOne({"username": username}).then(function (user) {
            user.comparePassword(password, function(err, isMatch) {
                if (err) return res.sendStatus(401);
                if (!isMatch) return res.sendStatus(401);
                var payload = {id: user._id};
                var token = jwt.encode(payload, cfg.jwtSecret);
                res.json({token: token});
            });
        });
    }
    else {
        res.sendStatus(401);
    }
});

module.exports = router;
