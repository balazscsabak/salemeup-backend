const express = require("express");
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config/database");
const router = express.Router();

router.post("/signup", function (req, res) {
	if (
		!req.body.email ||
		!req.body.password ||
		!req.body.firstname ||
		!req.body.lastname
	) {
		res.json({ success: false, msg: "Please pass username and password." });
	} else {
		const newUser = new Users({
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			password: req.body.password,
		});

		// save the user
		newUser.save(function (err) {
			if (err) {
				return res.json({ success: false, msg: "Username already exists." });
			}
			res.json({ success: true, msg: "Successful created new user." });
		});
	}
});

router.post("/signin/local", function (req, res) {
	Users.findOne(
		{
			email: req.body.email,
		},
		function (err, user) {
			if (err) throw err;

			if (!user) {
				res.status(401).send({
					success: false,
					msg: "Authentication failed. User not found.",
				});
			} else {
				// check if password matches
				user.comparePassword(req.body.password, function (err, isMatch) {
					if (isMatch && !err) {
						// if user is found and password is right create a token
						var token = jwt.sign(user.toObject(), config.secret);

						// return the information including token as JSON
						res.json({ success: true, token: "JWT " + token, user: user });
					} else {
						res.status(401).send({
							success: false,
							msg: "Authentication failed. Wrong password.",
						});
					}
				});
			}
		}
	);
});

//
router.get(
	"/me",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json({
			user: req.user,
		});
	}
);

module.exports = router;
