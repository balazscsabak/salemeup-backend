const { subDays, format } = require('date-fns');
const express = require('express');
const Categories = require('../models/Categories');
const slugify = require('slugify');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const categories = await Categories.getAllCategories();

		res.json({
			status: true,
			categories,
		});
	} catch (ex) {
		res.json({
			status: false,
			errMsg: ex.message,
		});
	}
});

router.post('/', async (req, res) => {
	try {
		const { parent, name, description } = req.body;

		if (!name) {
			return res.json({
				status: false,
				message: 'Name required',
			});
		}

		const newCategory = new Categories({
			parent: parent ?? '0',
			name,
			description,
			slug: slugify(name, {
				lower: true,
			}),
		});

		await newCategory.save();

		return res.json({
			status: true,
			category: newCategory,
		});
	} catch (error) {
		return res.json({
			status: false,
			message: error.message,
		});
	}
});

module.exports = router;
