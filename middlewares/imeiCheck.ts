// Import types
import type { RequestHandler } from "express";

// Import necessary modules
import { getUserImei } from "../helpers/userExists";

// Import the ResponsePayload utility
import ResponsePayload from "../utils/resGenerator";
import handleCatchError from "../utils/catchErrorHandler";

// Middleware function to check for IMEI
const checkForImei: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "checkForImei";

	// Check if the device is not mobile
	// If it's not, proceed to the next middleware function
	if (!req.flags.checkImei) {
		next();
	}

	// Initialize a new ResponsePayload instance
	const resPayload = new ResponsePayload();

	// Extract the user ID from the request parameters
	const { userId } = req.params;

	// Extract the user data from the request body
	const { userData } = req.body;

	try {
		// Try to get the user's IMEI
		const user = await getUserImei(userId);

		// Initialize response messages
		let resMessage = "";
		const resLogMessage = `-> response payload from ${funcName} controller`;

		// If the user exists
		if (user) {
			// If the user's IMEI does not match the IMEI in the request
			if (user.imeiNumber !== userData.imeiNumber) {
				// Set the response message
				resPayload.message = "user already logged in from other device";

				// Log the response payload
				res.log.info(resPayload, resLogMessage);

				// Return a conflict status with the response payload
				return res.status(409).json(resPayload);
			}
		} else {
			// If the user does not exist, set the response message
			resMessage = `the request was not completed because no user is present with id-: ${userId}`;
			resPayload.setConflict(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Return a not found status with the response payload
			return res.status(404).json(resPayload);
		}

		// If there were no issues, proceed to the next middleware function
		next();
	} catch (err) {
		// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};

// Export the middleware function
export default checkForImei;
