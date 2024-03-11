// Import types
import type mongoose from "mongoose";
import type CustomError from "../utils/customError";

// Import necessary modules
import category from "../models/category";

// Async Function to check if a category exists by name
export async function ifCategoryExistsByName(categoryName: string) {
	// Store the function name for error tracking
	const funcName = "ifCategoryExistsByName";

	try {
		// Try to find a category with the given name
		const categoryExists = await category.findOne(
			{
				name: categoryName, // Filter by category name
			},
			{ _id: true }, // Only return the _id field
		);

		// If a category was found, return true
		if (categoryExists) {
			return true;
		}

		// If no category was found, return false
		return false;
	} catch (err) {
		const customErr = err as CustomError;

		// Add the function name to the error object
		customErr.funcName = funcName;

		// Throw the error to be caught in the controller catch block
		throw customErr;
	}
}

// Async Function to check if a category exists by id
export async function ifCategoryExistsById(
	categoryId: string | mongoose.ObjectId,
) {
	// Store the function name for error tracking
	const funcName = "ifCategoryExistsById";

	try {
		// Try to find a category with the given name
		const categoryExists = await category.findById(categoryId, {
			_id: true,
		});

		// If a category was found, return true
		if (categoryExists) {
			return true;
		}

		// If no category was found, return false
		return false;
	} catch (err) {
		const customErr = err as CustomError;

		// Add the function name to the error object
		customErr.funcName = funcName;

		// Throw the error to be caught in the controller catch block
		throw customErr;
	}
}
