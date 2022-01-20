const config = require('./config/database');
const mongoose = require('mongoose');
const Sales = require('./models/Sales');
const randomWords = require('random-words');
const { subDays, format, addDays } = require('date-fns');
const Categories = require('./models/Categories');
const _ = require('lodash');

// make a connection
mongoose.connect(config.database, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// get reference to database
const db = mongoose.connection;
let _CATS = [];

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', async function () {
	console.log('start');

	const categories = await Categories.getAllParentCategories();

	categories.map((_C) => {
		_CATS.push(_C.id);
	});

	for (let i = 0; i < 1000; i++) {
		console.log(i);
		await waitMe(i);
	}

	console.log('end');
	return false;
});

function waitMe(i) {
	return new Promise((resolve) => {
		const productName = randomWords({ min: 4, max: 10, join: ' ' });

		const desc = randomWords({ min: 10, max: 40, join: ' ' });

		const oPrice = Math.floor(Math.random() * (20000 - -9000 + 1) + 9000);

		const toDate = new Date(addDays(new Date(), parseInt(4))).toISOString();

		const imgUrls = [
			'https://images.unsplash.com/photo-1619646176605-b7417fb53b1e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMzE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1549482199-bc1ca6f58502?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMjg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1615987130805-d0c61fb2274e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMjA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1485955900006-10f4d324d411?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMTc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMTU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMDk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1545289414-1c3cb1c06238?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMDg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1612548403247-aa2873e9422d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMDY&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1526434426615-1abe81efcb0b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMDU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgyMDE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1608571423539-e951b9b3871e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgxOTc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1549049950-48d5887197a0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgxOTE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1511499767150-a48a237f0083?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDgxODk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDg1MjU&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1587971051803-70bf6d4ae977?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDg1Mjc&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
			'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=700&ixid=MnwxfDB8MXxyYW5kb218MHx8cHJvZHVjdHx8fHx8fDE2Mzc3MDg1MzE&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
		];

		const newSales = new Sales({
			url: 'https://' + randomWords({ min: 1, max: 2, join: '-' }) + '.com',
			salePrice: parseInt(oPrice),
			originalPrice: parseInt(oPrice * 1.1),
			name: productName.charAt(0).toUpperCase() + productName.slice(1),
			description: desc.charAt(0).toUpperCase() + desc.slice(1),
			startDate: new Date().toISOString(),
			endDate: toDate,
			tags: randomWords({ min: 2, max: 6, maxLength: 7 }),
			category: _.sample(_CATS),
			active: true,
			img: imgUrls[Math.floor(Math.random() * imgUrls.length)],
			counter: Math.floor(Math.random() * (50 - -10 + 1) + -10),
		});

		newSales.save((err, newDocument) => {
			return resolve();
		});
	});
}
