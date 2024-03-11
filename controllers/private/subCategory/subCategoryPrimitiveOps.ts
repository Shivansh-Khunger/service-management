// Importing types
import type { RequestHandler } from "express";

// Import the necessary modules
import subCategory from "../../../models/subCategory";

import handleCatchError from "../../../utils/catchErrorHandler";
import ResponsePayload from "../../../utils/resGenerator";

// Function to create a new subcategory
export const newSubCategory: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "newSubCategory";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the subcategory data from the request body
	const { subCategoryData } = req.body;

	try {
		// Define the response messages
		let resMessage = "";
		const resLogMessage = `-> response payload for ${funcName} controller`;

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
		}
		// If the subcategory was not created successfully, set the conflict message
		resMessage = `the request to create a subCategory with name-: ${subCategoryData.name} is not successfull.`;

		// Set the response payload to conflict
		resPayload.setConflict(resMessage);

		// Log the response payload
		res.log.info(resPayload, resLogMessage);

		// Send the response payload
		return res.status(409).json(resPayload);
	} catch (err) {
		// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};

// Function to delete a subcategory
export const delSubCategory: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "deleteSubCategory";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the subcategory ID from the request parameters
	const { subCategoryId } = req.params;

	try {
		// Define the response messages
		let resMessage = "";
		const resLogMessage = `-> response payload for ${funcName} controller`;

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
		}
		// If the subcategory was not deleted successfully, set the conflict message
		resMessage = `the request to delete a subCategory with id-: ${subCategoryId} is not successfull.`;

		// Set the response payload to conflict
		resPayload.setConflict(resMessage);

		// Log the response payload
		res.log.info(resPayload, resLogMessage);

		// Send the response payload
		return res.status(409).json(resPayload);
	} catch (err) {
		handleCatchError({ next: next, err: err, funcName: funcName });
	}
};