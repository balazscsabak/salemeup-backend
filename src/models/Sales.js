const mongoose = require('mongoose');
const Categories = require('./Categories');

const SalesSchema = mongoose.Schema(
	{
		url: String,
		salePrice: Number,
		originalPrice: Number,
		name: String,
		description: String,
		startDate: Date,
		endDate: Date,
		tags: [],
		category: String,
		active: Boolean,
		counter: {
			type: Number,
			default: 0,
		},
		img: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

SalesSchema.pre('save', function (next) {
	this.updated_at = Date.now();
	next();
});

SalesSchema.statics.getTopRated = async function getTopRatedByDateAndLimit(
	date,
	limit
) {
	try {
		const sales = await this.find({
			createdAt: { $gt: date },
			counter: { $gt: 0 },
		})
			.sort({ counter: -1 })
			.limit(parseInt(limit));

		return sales;
	} catch (error) {
		return [];
	}
};

SalesSchema.statics.getLatest =
	async function getLatestOrderByCreatedAtAndLimit(limit) {
		try {
			const latestSales = await this.find()
				.sort({ createdAt: 1 })
				.limit(parseInt(limit));

			return latestSales;
		} catch (error) {
			return [];
		}
	};

SalesSchema.statics.getSalesByCategories = async function getSalesByCategories(
	date
) {
	try {
		const parentCategories = await Categories.getAllParentCategories();

		const salesByCategories = parentCategories.map(async (cat) => {
			const sales = await this.find({
				createdAt: { $gt: date },
				counter: { $gt: 0 },
				category: cat.id,
			})
				.sort({ counter: -1 })
				.limit(20);

			return {
				id: cat.id,
				name: cat.name,
				sales,
			};
		});

		return await Promise.all(salesByCategories);
	} catch (error) {
		return [];
	}
};

module.exports = mongoose.model('Sales', SalesSchema);
