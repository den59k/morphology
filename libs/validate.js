const Ajv = require('ajv');
const ajv = new Ajv();

module.exports =  function validate (req, res, schema){
	if(!schema.type) schema.type = "object"
	if(!req.body || !ajv.validate(schema, req.body)){
		res.statusCode = 400;
		res.json({error: "wrong request"});
		return false;
	}

	return true;
}