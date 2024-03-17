// Import types
import type { NextFunction } from "express";
import type { T_idDeal } from "../../models/deals";

// Import necessary modules
import deals from "../../models/deals";

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
