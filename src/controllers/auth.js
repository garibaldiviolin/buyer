var passport = require("passport");
var passportJWT = require("passport-jwt");
var User = require('../models/user');
var cfg = require("../config/production.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {        
        if (!('id' in payload)) {
            return done(null, false, { message: 'Unauthorized' });
        }

        /*if (!'exp' in payload) {
            return done(new Error("Expiration not found"), null);
        }*/

        User.findById(payload.id, function (err, user) {
            if (err || !user) {
                return done(null, false, { message: 'Unauthorized' });
            }
            return done(null, {id: user._id});
        });
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
