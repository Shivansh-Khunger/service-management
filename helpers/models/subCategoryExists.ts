// Import types
import type { NextFunction } from "express";
import type { T_idSubCategory } from "../../models/subCategory";

// Import necessary modules
import subCategory from "../../models/subCategory";

import augmentAndForwardError from "../../utils/errorAugmenter";

// Function to check if a subCategory exists by a criteria
async function ifSubCategoryExists(
	next: NextFunction,
	criteria: Partial<T_idSubCategory>,
) {
	const funcName = "ifSubCategoryExists";
	try {
		// Check if subCategory exists with given criteria
		const subCategoryExists = await subCategory.exists(criteria);

		// Return the result
		return subCategoryExists;
	} catch (err) {
		augmentAndForwardError({
			next: next,
			err: err,
			funcName: funcName,
		});
	}
}

export default ifSubCategoryExists;
