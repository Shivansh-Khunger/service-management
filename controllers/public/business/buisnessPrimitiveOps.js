// Importing necessary modules
import business from "../../../models/business.js";

import ResponsePayload from "../../../utils/resGenerator.js";

// Function to create a new business
export async function newBusiness(req, res, next) {
	const funcName = `newBusiness`;

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

		let resMessage = ``;
		let resLogMessage = `-> response for ${funcName} function`;

		if (newBusiness) {
			// Create a success message
			resMessage = `request to create business-: ${businessData.businessName} by user -:${businessData.businessOwner} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage, newBusiness);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Return the response payload with status 201
			return res.status(201).json(resPayload);
		} else {
			resMessage = `request to create business-: ${businessData.businessName} by user -:${businessData.businessOwner} is not successfull.`;

			resPayload.setConflict(resMessage);

			res.log.info(resPayload, resLogMessage);

			return res.status(409).json(resPayload);
		}
	} catch (err) {
		// If an error occurs, set the function name in the error and pass it to the next middleware
		err.funcName = funcName;

		next(err);
	}
}

// Function to delete a business
export async function delBusiness(req, res, next) {
	const funcName = `delBusiness`;

	// Create a new instance of ResponsePayload
	const resPayload = new ResponsePayload();

	// Extract business id from request params
	const { businessId } = req.params;

	try {
		// Delete the business with the id from the request parameters
		const deletedBusiness = await business.findByIdAndDelete(businessId);

		const resLogMessage = `-> response for ${funcName} controller`;

		console.log(deletedBusiness);

		// If the business was successfully deleted
		if (deletedBusiness._id.toString() === businessId) {
			// Set the success message
			const resMessage = `Request to delete business-: ${businessId} is successfull.`;

			// Set the success response payload
			resPayload.setSuccess(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Return the response payload with status 200
			return res.status(200).json(resPayload);
		} else {
			// If the business could not be deleted, create a new error
			const errMessage = `Request to delete business-: ${businessId} is not successfull.`;

			const err = new Error(errMessage);

			// Set the function name in the error
			err.funcName = funcName;

			// Set reponse code
			err.status = 404;

			// Pass the error to the next middleware
			next(err);
		}
	} catch (err) {
		// If an error occurs, set the function name in the error and pass it to the next middleware
		err.funcName = funcName;

		next(err);
	}
}
