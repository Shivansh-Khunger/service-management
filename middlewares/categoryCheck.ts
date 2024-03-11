// Import types
import type { Request, Response, NextFunction } from "express";

// Import necessary modules
import {
	ifCategoryExistsByName,
	ifCategoryExistsById,
} from "../helpers/categoryExists";

import CustomError from "../utils/customError";
import handleCatchError from "../utils/catchErrorHandler";

function handleAbsentCategory(categoryAttr: string) {
	const errMessage = `the request could not be completed because the category-: ${categoryAttr} already exists.`;

	const err = new CustomError(errMessage);
	err.status = 400;

	throw err;
}

export const checkForCategory = (checkIn: string, entity: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const funcName = "checkForCategory";

		let categoryAttr: string;
		let categoryExists: boolean;
		try {
			switch (checkIn) {
				case "body":
					categoryAttr = req.body.categoryData[entity];

					categoryExists = await ifCategoryExistsByName(categoryAttr);

					if (!categoryExists) {
						handleAbsentCategory(categoryAttr);
					}
					next();
					break;

				case "query":
					// added for future use
					break;

				case "params":
					categoryAttr = req.params[entity];

					categoryExists = await ifCategoryExistsById(categoryAttr);

					if (!categoryExists) {
						handleAbsentCategory(categoryAttr);
					}
					next();
					break;

				default:
				// throw new Error(`Invalid checkIn value: ${checkIn}`);
			}
		} catch (err) {
			// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
			handleCatchError({ next: next, err: err, funcName: funcName });
		}
	};
};
