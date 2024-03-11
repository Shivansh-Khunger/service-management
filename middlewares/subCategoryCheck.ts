// Import types
import type { Request, Response, NextFunction } from "express";

// Import necessary modules
import {
	ifSubCategoryExistsByName,
	ifSubCategoryExistsById,
} from "../helpers/subCategoryExists";

import CustomError from "../utils/customError";
import handleCatchError from "../utils/catchErrorHandler";

function handleAbsentSubCategory(subCategoryAttr: string) {
	const errMessage = `the request could not be completed because the sub-category-: ${subCategoryAttr} already exists.`;

	const err = new CustomError(errMessage);
	err.status = 400;

	throw err;
}

export const checkForSubCategory = async (checkIn: string, entity: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const funcName = "checkForSubCategory";

		let subCategoryAttr: string;
		let subCategoryExists: boolean;
		try {
			switch (checkIn) {
				case "body":
					subCategoryAttr = req.body.subCategoryData[entity];

					subCategoryExists = await ifSubCategoryExistsByName(subCategoryAttr);

					if (!subCategoryExists) {
						handleAbsentSubCategory(subCategoryAttr);
					}
					next();
					break;

				case "query":
					// added for future use
					break;

				case "params":
					subCategoryAttr = req.params[entity];

					subCategoryExists = await ifSubCategoryExistsById(subCategoryAttr);

					if (!subCategoryExists) {
						handleAbsentSubCategory(subCategoryAttr);
					}
					next();
					break;

				default: {
					const errMessage = `the request could not be completed because the checkIn-: ${checkIn} is not supported.`;

					const err = new CustomError(errMessage);
					err.status = 400;

					throw err;
				}
			}
		} catch (err) {
			// Handle the caught error by passing it to the handleCatchError function which will pass it to the error handling middleware
			handleCatchError({ next: next, err: err, funcName: funcName });
		}
	};
};
