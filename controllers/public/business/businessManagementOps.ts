// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import business from "../../../models/business";

import handleCatchError from "../../../utils/catchErrorHandler";
import ResponsePayload from "../../../utils/resGenerator";

// Function to update a business
export const updateBusiness: RequestHandler = async (req, res, next) => {
	const funcName = "updateBusiness";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	const { businessId } = req.params;

	// Extract the updated business data from the request body
	const { latestBusiness } = req.body;

	try {
		// Attempt to find the business by its ID and update it
		const updatedBusiness = await business.findByIdAndUpdate(
			businessId,
			latestBusiness,
			{ new: true },
		);

		let resMessage: string;
		const resLogMessage = `-> response for ${funcName} controller`;
		// If the business was successfully updated
		if (updatedBusiness) {
			// Create a success message
			resMessage = `business with id-: ${req.params.businessId} has been updated.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage, updatedBusiness);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response with a 200 status code
			return res.status(200).json(resPayload);
		}
		// If the product could not be updated, create a conflict message
		resMessage = `business with id-: ${req.params.businessId} could not be updated.`;

		resPayload.setConflict(resMessage);

		res.log.info(resPayload, resLogMessage);

		return res.status(409).json(resPayload);
	} catch (err) {
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};
