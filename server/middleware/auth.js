import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		const isCustomAuth = token.length < 500;
		// console.log(req);
		let decodedData;

		if (token && isCustomAuth) {
			//syncronize verify
			decodedData = jwt.verify(token, 'secret');

			req.userId = decodedData?.id;
		} else {
			decodedData = jwt.decode(token);
			console.log(decodedData);
			//sub is an variable hold different google user uniquer Id data
			req.userId = decodedData?.sub;
		}

		next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;
