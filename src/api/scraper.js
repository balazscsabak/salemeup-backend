const express = require("express");
const ogs = require("open-graph-scraper");

const router = express.Router();

router.get("/", (req, res) => {
	const scrappUrl = req.query.url;

	if (!scrappUrl) {
		return res.json({
			status: false,
			error: "No url found",
		});
	}

	const options = { url: scrappUrl, ogImageFallback: true };

	ogs(options, (error, results, response) => {
		res.json({
			status: true,
			error,
			results,
		});
	});
});

module.exports = router;
