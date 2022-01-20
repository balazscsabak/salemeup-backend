const { subDays, format } = require('date-fns');
const express = require('express');
const Sales = require('../models/Sales');

const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		message: 'sales',
	});
});

router.post('/', (req, res) => {
	const {
		url,
		salePrice,
		originalPrice,
		name,
		description,
		startDate,
		endDate,
		tags,
		category,
	} = req.body;

	const newSales = new Sales({
		url,
		salePrice,
		originalPrice,
		name,
		description,
		startDate,
		endDate,
		tags,
		category,
		active: true,
		// counter: Math.floor(Math.random() * (50 - -10 + 1) + -10),
	});

	newSales.save((err, newDocument) => {
		if (err) {
			return res.json({
				status: false,
				error: err,
			});
		}

		return res.json({
			status: true,
			data: newDocument,
		});
	});
});

router.get('/latest/:limit', async (req, res) => {
	try {
		const limit = req.params.limit;

		const latestSales = await Sales.getLatest(limit);

		return res.json({
			status: true,
			sales: latestSales,
		});
	} catch (error) {
		return res.json({
			status: false,
			message: error.message,
		});
	}
});

router.get('/top-rated/days/:days/:limit', async (req, res) => {
	try {
		const days = req.params.days;
		const limit = req.params.limit;

		let substractedDay = new Date(
			subDays(new Date(), parseInt(days))
		).toISOString();

		const sales = await Sales.getTopRated(substractedDay, limit);

		return res.json({
			status: true,
			days,
			limit,
			substractedDay: substractedDay,
			sales,
		});
	} catch (error) {
		return res.json({
			status: false,
			message: error.message,
		});
	}
});

router.get('/frontpage', async (req, res) => {
	try {
		let substractedDay = new Date(
			subDays(new Date(), parseInt(1))
		).toISOString();

		const latestSales = await Sales.getLatest(20);
		const topRatedSales = await Sales.getTopRated(substractedDay, 19);
		const salesByCategories = await Sales.getSalesByCategories(substractedDay);

		return res.json({
			status: true,
			salesByCategories,
			topRatedSales,
			latestSales,
		});
	} catch (error) {
		return res.json({
			status: false,
			message: error.message,
		});
	}
});

module.exports = router;
