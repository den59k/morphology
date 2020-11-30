const validate = require('libs/validate')

module.exports =  function rest (options) {

	return async (req, res) => {
		try{
			let startValues = {};
			if(options.init)
				startValues = await options.init(req, res);

			let answer = null;
			if(req.method === 'GET' && options.get)
				answer = await options.get(startValues)
			
			if(req.method === 'POST' && options.post){
				if(options.postSchema && !validate(req, res, options.postSchema)) return;
				answer = await options.post({...startValues, ...req.body}, req, res)
			}

			if(req.method === 'PUT' && options.put){
				if(options.putSchema && !validate(req, res, options.putSchema)) return;
				answer = await options.put({...startValues, ...req.body}, req, res)
			}

			if(req.method === 'DELETE' && options.delete){
				if(options.deleteSchema && !validate(req, res, options.deleteSchema)) return;
				answer = await options.delete({...startValues, ...req.body}, req, res)
			}


			if(answer){
				res.statusCode = answer.statusCode || 200;
				delete answer.statusCode;

				res.json(answer);
			}
			else{
				res.statusCode = 405;
				res.json({error: "wrong method"});
			}

		}catch(e){
			//Здесь обработка всех ошибок. В основном - это ошибки с БД
			res.statusCode = 400;
			switch(e.code){
				case 11000: res.json({error: "already exists"}); break;
				case 1024: res.json({error: "wrong password"}); break;
				default: console.log(e); res.json(e);
			}
		}
	}
}