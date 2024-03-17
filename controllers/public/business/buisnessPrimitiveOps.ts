// Importing types
import type { RequestHandler } from "express";

// Importing necessary modules
import business from "../../../models/business";

import augmentAndForwardError from "../../../utils/errorAugmenter";
import CustomError from "../../../utils/customError";
import ResponsePayload from "../../../utils/resGenerator";

// Function to create a new business
export const newBusiness: RequestHandler = async (req, res, next) => {
	const funcName = "newBusiness";

	// Create a new instance of ResponsePayload
	const resPayload = new ResponsePayload();

	// Extract business object from request body
	const { businessData } = req.body;

	try {
		// Create a new business with the data from the request body
		const newBusiness = await business.create({
			// Business basic details
			name: businessData.businessName,
			owner: businessData.businessOwner,

			// Business operation timings
			openingTime: businessData.businessOpeningTime,
			closingTime: businessData.businessClosingTime,

			// Business contact details
			phoneNumber: businessData.businessPhoneNumber,
			landline: businessData.businessLandline,
			email: businessData.businessEmail,

			// Business online presence
			website: businessData.businessWebsite,
			imageUrls: businessData.businessImageUrls,

			// Business location and payment details
			geoLocation: businessData.businessGeoLocation,
			upiId: businessData.businessUpiId,

			// Manager contact details
			managerContact: {
				managerPhoneNumber: businessData.managerPhoneNumber,
				managerEmail: businessData.managerEmail,
			},

			// Business type and category
			businessType: businessData.businessType,
			businessCategory: businessData.businessCategory,
			businessSubCategory: businessData.businessSubCategory,

			// Brands
			brands: businessData.businessBrands,
		});

		let resMessage = "";
		const resLogMessage = `-> response for ${funcName} function`;

		if (newBusiness) {
			// Create a success message
			resMessage = `request to create business-: ${businessData.businessName} by user -:${businessData.businessOwner} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage, newBusiness);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Return the response payload with status 201
			return res.status(201).json(resPayload);
		}
		resMessage = `request to create business-: ${businessData.businessName} by user -:${businessData.businessOwner} is not successfull.`;

		resPayload.setConflict(resMessage);

		res.log.info(resPayload, resLogMessage);

		return res.status(409).json(resPayload);
	} catch (err) {
		// Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
		augmentAndForwardError({ next: next, err: err, funcName: funcName });
	}
};

// Function to delete a business
export const delBusiness: RequestHandler = async (req, res, next) => {
	const funcName = "delBusiness";

	// Create a new instance of ResponsePayload
	const resPayload = new ResponsePayload();

	// Extract business id from request params
	const { businessId } = req.params;

	try {
		// Delete the business with the id from the request parameters
		const deletedBusiness = await business.findByIdAndDelete(businessId);

		const resLogMessage = `-> response for ${funcName} controller`;

		// If the business was successfully deleted
		if (deletedBusiness?._id.toString() === businessId) {
			// Set the success message
			const resMessage = `Request to delete business-: ${businessId} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Return the response payload with status 200
			return res.status(200).json(resPayload);
		}
		// If the business could not be deleted, create a new error
		const errMessage = `Request to delete business-: ${businessId} is not successfull.`;

		const err = new CustomError(errMessage);

		// Set the function name in the error
		err.funcName = funcName;

		// Set reponse code
		err.status = 404;

		// Pass the error to the next middleware
		next(err);
	} catch (err) {
		augmentAndForwardError({ next: next, err: err, funcName: funcName });
	}
};
