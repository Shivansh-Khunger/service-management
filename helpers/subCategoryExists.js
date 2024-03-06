// Import the subCategory model
import subCategory from "../models/subCategory.js";

// Function to check if a subCategory exists by name
export async function ifSubCategoryExistsByName(subCategoryName) {
	// Store the function name for error tracking
	const funcName = `ifSubCategoryExists`;

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
		// Add the function name to the error object
		err.funcName = funcName;

		// Throw the error to be caught in an outer catch block
		throw err;
	}
}

// Function to check if a subCategory exists by id
export async function ifSubCategoryExistsById(subCategoryId) {
	// Store the function name for error tracking
	const funcName = `ifSubCategoryExistsById`;

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
		// Add the function name to the error object
		err.funcName = funcName;

		// Throw the error to be caught in an outer catch block
		throw err;
	}
}
