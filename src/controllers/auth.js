var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("../models/user.js");
var cfg = require("../config/production.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        console.log("payload"+payload);
        if (!'id' in payload) {
            console.log("nao achou payload");
            return done(new Error("User not found"), null);
        }

        if (!'exp' in payload) {
            console.log("nao achou exp");
            return done(new Error("Expiration not found"), null);
        }

        return done(null, {id: payload._id});

        if (user) {
            return done(null, {id: user.id});
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
