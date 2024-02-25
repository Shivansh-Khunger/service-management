import generateRes from "../utils/resGenerator";

async function validateInput({ req, res, next, schema, funcName, valParams }) {
	const resPayload = generateRes();

	let err;
	if (valParams) {
		({ err } = schema.validate(req.params));
	} else {
		({ err } = schema.validate(req.body));
	}

	if (err) {
		resPayload.message = err.details[0].message;
		resPayload.hasError = true;

		res.log.error(
			err,
			`-> input validation error has occured while transfering req to ${funcName} function`,
		);
		return res.status(400).json(resPayload);
	}

	next();
}

export default validateInput;
