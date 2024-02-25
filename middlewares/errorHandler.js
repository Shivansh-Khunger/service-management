import ResponsePayload from "../utils/resGenerator.js";

function handleError(err, req, res, next) {
	const resPayload = new ResponsePayload();

	const status = err.status || 500;
	const message = err.message || `server error`;

	resPayload.setError(message);

	res.log.error(err, `-> error has occured in the ${err.funcName} function`);
	res.status(status).json(resPayload);

	next();
}

export default handleError;
