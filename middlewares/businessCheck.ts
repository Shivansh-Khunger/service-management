// Import types
import type { RequestHandler } from "express";

// Import necessary modules
import business from "../models/business";

import CustomError from "../utils/customError";
import handleCatchError from "../utils/catchErrorHandler";

// Middleware function to check if a business exists
const checkForBusiness: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "checkForBusiness";

	const { businessId } = req.params;

	try {
		// Try to find the business with the given ID
		const ifBusiness = await business.findById(businessId);

		// If the business exists, proceed to the next middleware function
		if (ifBusiness) {
			next();
		} else {
			// If the business does not exist, create an error message
			const errMessage = `business-: ${businessId} does not exist.`;

			// Create a new error with the error message
			const err = new CustomError(errMessage);

			// Set the HTTP status code for the error
			err.status = 404;

			throw err;
		}
	} catch (err) {
		// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};

// Export the middleware function
export default checkForBusiness;
