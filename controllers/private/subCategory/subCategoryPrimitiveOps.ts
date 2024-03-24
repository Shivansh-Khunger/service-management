// Importing types
import type { RequestHandler } from "express";

// Import the necessary modules
import subCategory from "../../../models/subCategory";

import augmentAndForwardError from "../../../utils/errorAugmenter";
import ResponsePayload from "../../../utils/resGenerator";

const collectionName = "SubCategory";
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
		const newSubCategory = await subCategory.create({ ...subCategoryData });

		if (newSubCategory) {
			// If the subcategory was created successfully, set the success message
			resMessage = `Request to create ${collectionName}-: ${subCategoryData.name} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, newSubCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(201).json(resPayload);
		}
		// If the subcategory was not created successfully, set the conflict message
		resMessage = `Request to create ${collectionName}-: ${subCategoryData.name} is unsuccessfull.`;

		// Set the response payload to conflict
		resPayload.setConflict(resMessage);

		// Log the response payload
		res.log.info(resPayload, resLogMessage);

		// Send the response payload
		return res.status(409).json(resPayload);
	} catch (err) {
		// Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
		augmentAndForwardError({ next: next, err: err, funcName: funcName });
	}
};

// Function to delete a subcategory
export const delSubCategory: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "deleteSubCategory";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the subcategory ID from the request parameters
	const { subCategoryName } = req.params;

	try {
		// Define the response messages
		let resMessage = "";
		const resLogMessage = `-> response payload for ${funcName} controller`;

		// Delete the subcategory
		const deletedSubCategory = await subCategory.findOneAndDelete({
			name: subCategoryName,
		});

		if (deletedSubCategory?.name === subCategoryName) {
			// If the subcategory was deleted successfully, set the success message
			resMessage = `Request to delete ${collectionName}-: ${subCategoryName} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		}
		// If the subcategory was not deleted successfully, set the conflict message
		resMessage = `Request to delete ${collectionName}-: ${subCategoryName} is unsuccessfull.`;

		// Set the response payload to conflict
		resPayload.setConflict(resMessage);

		// Log the response payload
		res.log.info(resPayload, resLogMessage);

		// Send the response payload
		return res.status(409).json(resPayload);
	} catch (err) {
		augmentAndForwardError({ next: next, err: err, funcName: funcName });
	}
};
