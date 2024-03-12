// Importing types
import type { RequestHandler } from "express";

// Import the necessary modules
import category from "../../../models/category";
import subCategory from "../../../models/subCategory";

import handleCatchError from "../../../utils/catchErrorHandler";
import ResponsePayload from "../../../utils/resGenerator";

// Function to create a new category
export const newCategory: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "newCategory";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the category data from the request body
	const { categoryData } = req.body;

	try {
		// Define the response messages
		let resMessage = "";
		const resLogMessage = `-> response payload for ${funcName} controller`;

		// Create a new category
		const newCategory = await category.create({
			name: categoryData.name,
			image: categoryData.image,
			description: categoryData.description,
		});

		if (newCategory) {
			// If the category was created successfully, set the success message
			resMessage = `the request to create a user with name-: ${categoryData.name} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, newCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		}
		// If the category was not created successfully, set the conflict message
		resMessage = `the request to create a user with name-: ${categoryData.name} is not successfull.`;

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

// Function to delete a category
export const delCategory: RequestHandler = async (req, res, next) => {
	// Define the function name for error handling
	const funcName = "deleteCategory";

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the category ID from the request parameters
	const { categoryName } = req.params;

	try {
		// Define the response messages
		let resMessage = "";
		const resLogMessage = `-> response payload for ${funcName} controller`;

		// Delete the category
		const deletedCategory = await category.findOneAndDelete({
			name: categoryName,
		});

		// Delete all subcategories associated with the category
		subCategory
			.deleteMany({
				categoryId: deletedCategory?._id,
			})
			.catch((err) => {
				// Add the function name to the error object for debugging
				err.funcName = funcName;

				// Pass the error to the next middleware
				next(err);
			});

		if (deletedCategory?.name === categoryName) {
			// If the category was deleted successfully, set the success message
			resMessage = `the request to delete a category with id-: ${deletedCategory?._id} and name -: ${categoryName} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, deletedCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		}
		// If the category was not deleted successfully, set the conflict message
		resMessage = `the request to delete a category with name-: ${categoryName} is not successfull.`;

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
