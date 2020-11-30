const getDB = require('libs/db')
const rest = require('libs/rest')

const properties = {
	word: { type: "string", minLength: 1 }
}

export default rest ({
	init: async (req, res) => {
		const db = await getDB('words');
		return { db };
	},

	get: async ({db}) => {
		const res = await db.find({}, { sort: {time: -1}, projection: { word: 1 } }).toArray();

		return {words: res};
	},

	postSchema: { properties, required: [ "word"] },
	post: async ({db, word}) => {
		
		const res = await db.insertOne({word, time: Date.now()});

		return { count: res.insertedCount };
	}

});