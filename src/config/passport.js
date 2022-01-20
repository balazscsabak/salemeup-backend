const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// load up the user model
const Users = require("../models/Users");
const config = require("../config/database"); // get db config file

module.exports = function (passport) {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");

	opts.secretOrKey = config.secret;

	passport.use(
		new JwtStrategy(opts, function (jwt_payload, done) {
			Users.findOne({ id: jwt_payload.id }, function (err, user) {
				if (err) {
					return done(err, false);
				}
				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			});
		})
	);
};
