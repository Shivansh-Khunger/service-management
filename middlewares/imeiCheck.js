import user from "../models/user";

import generateRes from "../utils/resGenerator";

async function checkForImei(req, res, next) {
	//check for imei number
	let resPayload = generateRes();

	try {
		let usrFound = await user.findOne(
			{
				_id: req.params.id,
			},
			{ _id: true0 },
		);

		if (usrFound == null) {
			resPayload.message = "user not found";

			res.log.info(
				resPayload,
				"-> response payload from checkForImei function",
			);
			return res.status(404).json(resPayload);
		}

		if (usrFound.imeiNumber != req.body.imeiNumber) {
			resPayload.message = "user already logged in from other device";

			res.log.info(
				resPayload,
				"-> response payload from checkForImei function",
			);
			return res.status(409).json(resPayload);
		}

		next();
	} catch (err) {
		resPayload.message = "Server Error.";
		resPayload.hasError = true;

		res.log.error(err, "-> an error has occured in checkForImei function.");
		res.status(500).json(resPayload);
	}
}

export default checkForImei;
