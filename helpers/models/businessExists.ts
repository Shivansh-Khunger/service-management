// Import types
import type { NextFunction } from "express";
import type { T_idBusiness } from "../../models/business";

// Import necessary modules
import business from "../../models/business";

import augmentAndForwardError from "../../utils/errorAugmenter";

// Function to check if a business exists by the criteria
async function ifBusinessExists(
	next: NextFunction,
	criteria: Partial<T_idBusiness>,
) {
	const funcName = "ifBusinessExists";
	try {
		// Try to find the business
		const businessExists = await business.exists(criteria);

		return businessExists;
	} catch (err) {
		augmentAndForwardError({
			next: next,
			err: err,
			funcName: funcName,
		});
	}
}

export default ifBusinessExists;
