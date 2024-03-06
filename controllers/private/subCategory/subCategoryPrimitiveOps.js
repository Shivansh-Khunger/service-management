// Import the necessary models and utilities
import subCategory from "../../../models/subCategory.js";

import ResponsePayload from "../../../utils/resGenerator.js";

// Function to create a new subcategory
export async function newSubCategory(req, res, next) {
	// Define the function name for error handling
	const funcName = `newSubCategory`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the subcategory data from the request body
	const { subCategoryData } = req.body;

	try {
		// Define the response messages
		let resMessage = ``;
		let resLogMessage = `-> response payload for ${funcName} controller`;

		// Create a new subcategory
		const newSubCategory = await subCategory.create({
			name: subCategoryData.name,
			image: subCategoryData.image,
			description: subCategoryData.description,
			categoryId: subCategoryData.categoryId,
		});

		if (newSubCategory) {
			// If the subcategory was created successfully, set the success message
			resMessage = `the request to create a subCategory with name-: ${subCategoryData.name} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, newSubCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		} else {
			// If the subcategory was not created successfully, set the conflict message
			resMessage = `the request to create a subCategory with name-: ${subCategoryData.name} is not successfull.`;

			// Set the response payload to conflict
			resPayload.setConflict(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(409).json(resPayload);
		}
	} catch (err) {
		// Add the function name to the error object for debugging
		err.funcName = funcName;

		// Pass the error to the next middleware
		next(err);
	}
}

// Function to delete a subcategory
export async function delSubCategory(req, res, next) {
	// Define the function name for error handling
	const funcName = `deleteSubCategory`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the subcategory ID from the request parameters
	const { subCategoryId } = req.params;

	try {
		// Define the response messages
		let resMessage = ``;
		let resLogMessage = `-> response payload for ${funcName} controller`;

		// Delete the subcategory
		const deletedSubCategory =
			await subCategory.findByIdAndDelete(subCategoryId);

		if (deletedSubCategory) {
			// If the subcategory was deleted successfully, set the success message
			resMessage = `the request to delete a subCategory with id-: ${subCategoryId} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, deletedSubCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		} else {
			// If the subcategory was not deleted successfully, set the conflict message
			resMessage = `the request to delete a subCategory with id-: ${subCategoryId} is not successfull.`;

			// Set the response payload to conflict
			resPayload.setConflict(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(409).json(resPayload);
		}
	} catch (err) {
		// Add the function name to the error object for debugging
		err.funcName = funcName;

		// Pass the error to the next middleware
		next(err);
	}
}
