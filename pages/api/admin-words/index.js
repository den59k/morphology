const getDB = require('libs/db')
const rest = require('libs/rest')
const { ObjectID } = require('mongodb')

const properties = {
	_id: { type: "string" }
}

class PasswordError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "Password Error"; // (2)
  	this.code = 1024;
  }
}


export default rest ({
	init: async (req, res) => {

		if(req.cookies.token !== process.env.PASSWORD)
			throw new PasswordError('wrong password');
		const db = await getDB('words');
		return { db };
	},

	get: async ({db}) => {
		const res = await db.find({}, { sort: {time: -1}, projection: { word: 1, time: 1 } }).toArray();

		return res;
	},

	deleteSchema: { properties, required: [ "_id"] },
	delete: async ({db, _id}) => {
		
		const res = await db.deleteOne({_id: new ObjectID(_id)});

		return { count: res.deletedCount }
	}

});