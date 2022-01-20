const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema(
	{
		parent: {
			type: String,
			default: '0',
		},
		name: String,
		slug: String,
		description: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

CategoriesSchema.pre('save', function (next) {
	this.updated_at = Date.now();
	next();
});

CategoriesSchema.statics.getAllParentCategories =
	async function getAllParentCategories() {
		const _categories = await this.find({ parent: '0' });
		const categories = [];

		_categories.map((c) => {
			categories.push({
				id: c.id,
				name: c.name,
			});
		});

		return categories;
	};

CategoriesSchema.statics.getAllCategories = async function getAllCategories() {
	const _categories = await this.find({});

	let categoriesParents = {};

	_categories.map((cat) => {
		if (cat.parent === '0') {
			categoriesParents[cat._id] = {
				_id: cat._id,
				slug: cat.slug,
				name: cat.name,
				createdAt: cat.createdAt,
				updatedAt: cat.updatedAt,
				description: cat.description,
				children: [],
			};
		}
	});

	_categories.map((cat) => {
		if (cat.parent !== '0') {
			categoriesParents[cat.parent].children.push(cat);
		}
	});

	const categories = [];

	Object.keys(categoriesParents).map((id) => {
		categories.push(categoriesParents[id]);
	});

	return categories;
};

module.exports = mongoose.model('Categories', CategoriesSchema);
