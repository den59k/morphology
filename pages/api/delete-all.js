const getDB = require('libs/db')
const rest = require('libs/rest')

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

	delete: async ({db}) => {

		const res = await db.deleteMany({});

		return { count: res.deletedCount }
	}

});