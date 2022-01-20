const express = require('express');

const sales = require('./sales');
const scraper = require('./scraper');
const auth = require('./auth');
const categories = require('./categories');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'API - 👋🌎🌍🌏',
	});
});

router.use('/sales', sales);
router.use('/url-scraper', scraper);
router.use('/auth', auth);
router.use('/categories', categories);

module.exports = router;
