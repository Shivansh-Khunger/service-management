// Import the necessary models and utilities
import category from "../../../models/category.js";
import subCategory from "../../../models/subCategory.js";

import ResponsePayload from "../../../utils/resGenerator.js";

// Function to create a new category
export async function newCategory(req, res, next) {
	// Define the function name for error handling
	const funcName = `newCategory`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the category data from the request body
	const { categoryData } = req.body;

	try {
		// Define the response messages
		let resMessage = ``;
		let resLogMessage = `-> response payload for ${funcName} controller`;

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
		} else {
			// If the category was not created successfully, set the conflict message
			resMessage = `the request to create a user with name-: ${categoryData.name} is not successfull.`;

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

// Function to delete a category
export async function deleteCategory(req, res, next) {
	// Define the function name for error handling
	const funcName = `deleteCategory`;

	// Create a new response payload
	const resPayload = new ResponsePayload();

	// Extract the category ID from the request parameters
	const { categoryId } = req.params;

	try {
		// Define the response messages
		let resMessage = ``;
		let resLogMessage = `-> response payload for ${funcName} controller`;

		// Delete all subcategories associated with the category
		subCategory
			.deleteMany({
				categoryId: categoryId,
			})
			.catch((err) => {
				// Add the function name to the error object for debugging
				err.funcName = funcName;

				// Pass the error to the next middleware
				next(err);
			});

		// Delete the category
		const deletedCategory = await category.findByIdAndDelete(categoryId, {
			new: true,
		});

		if (deletedCategory) {
			// If the category was deleted successfully, set the success message
			resMessage = `the request to delete a category with id-: ${categoryId} is successfull.`;

			// Set the response payload to success
			resPayload.setSuccess(resMessage, deletedCategory);

			// Log the response payload
			res.log.info(resPayload, resLogMessage);

			// Send the response payload
			return res.status(200).json(resPayload);
		} else {
			// If the category was not deleted successfully, set the conflict message
			resMessage = `the request to delete a category with id-: ${categoryId} is not successfull.`;

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
