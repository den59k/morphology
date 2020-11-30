const getDB = require('libs/db')
const rest = require('libs/rest')

const properties = {
	password: { type: "string", minLength: 3 }
}

export default rest ({
	postSchema: { properties, required: [ "password"] },
	post: async ({password}, req, res) => {
	
		if(password === process.env.PASSWORD){
			res.setHeader('Set-Cookie', 'token='+password);
			return { success: "success"};
		}
		
		return { error: "wrong password" };
	}

});