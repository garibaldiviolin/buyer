var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("../controllers/auth.js")();
var cfg = require("../config/index");
var express = require('express');
var moment = require("moment");


var router = express.Router();

var User = require('../models/user');

var user_controller = require("../controllers/auth");

router.post('/token', function(req, res) {
    if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;

        var query = User.findOne({"username": username}, function (err, user) {
            if (err || !user) return res.sendStatus(401);
            user.comparePassword(password, function(err, isMatch) {
                if (!isMatch) return res.sendStatus(401);
                let expires = moment().utc().add({ minutes: 30 }).unix();
                var payload = {
                    id: user._id,
                    exp: expires
                };
                var token = jwt.encode(payload, cfg.jwtSecret);
                return res.json({token: token});
            });
        });
    }
    else {
        return res.sendStatus(401);
    }
});

module.exports = router;
