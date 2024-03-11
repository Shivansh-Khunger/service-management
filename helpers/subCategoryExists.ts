// Import types
import type mongoose from "mongoose";
import type CustomError from "../utils/customError";

// Import necessar modules
import subCategory from "../models/subCategory";

// Function to check if a subCategory exists by name
export async function ifSubCategoryExistsByName(subCategoryName: string) {
	// Store the function name for error tracking
	const funcName = "ifSubCategoryExistsByName";

	try {
		// Try to find a subCategory with the given name
		const subCategoryExists = await subCategory.findOne(
			{
				name: subCategoryName, // Filter by subCategory name
			},
			{ _id: true }, // Only return the _id field
		);

		// If a subCategory was found, return true
		if (subCategoryExists) {
			return true;
		}

		// If no subCategory was found, return false
		return false;
	} catch (err) {
		const customErr = err as CustomError;

		// Add the function name to the error object
		customErr.funcName = funcName;

		// Throw the error to be caught in the controller catch block
		throw customErr;
	}
}

// Function to check if a subCategory exists by id
export async function ifSubCategoryExistsById(
	subCategoryId: string | mongoose.ObjectId,
) {
	// Store the function name for error tracking
	const funcName = "ifSubCategoryExistsById";

	try {
		// Try to find a subCategory with the given name
		const subCategoryExists = await subCategory.findById(subCategoryId, {
			_id: true,
		});

		// If a subCategory was found, return true
		if (subCategoryExists) {
			return true;
		}

		// If no subCategory was found, return false
		return false;
	} catch (err) {
		const customErr = err as CustomError;

		// Add the function name to the error object
		customErr.funcName = funcName;

		// Throw the error to be caught in the controller catch block
		throw customErr;
	}
}
