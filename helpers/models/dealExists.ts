// Import types
import type { NextFunction } from "express";
import type { T_idDeal } from "../../models/deal";

// Import necessary modules
import deals from "../../models/deal";

import augmentAndForwardError from "../../utils/errorAugmenter";

// Function to check if a deal exists by the criteria
async function ifDealExists(next: NextFunction, criteria: Partial<T_idDeal>) {
	const funcName = "ifDealExists";
	try {
		// Try to find the deal
		const dealExists = await deals.exists(criteria);

		return dealExists;
	} catch (err) {
		augmentAndForwardError({
			next: next,
			err: err,
			funcName: funcName,
		});
	}
}

export default ifDealExists;
