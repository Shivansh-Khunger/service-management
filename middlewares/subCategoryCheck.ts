// Import types
import type { NextFunction, Request, Response } from "express";

// Import necessary modules
import {
	ifSubCategoryExistsById,
	ifSubCategoryExistsByName,
} from "../helpers/subCategoryExists";

import handleCatchError from "../utils/catchErrorHandler";
import CustomError from "../utils/customError";

interface SubCategoryCheckOptions {
	checkIn: "body" | "query" | "params";
	entity: string;
}

export const checkForSubCategory = ({
	checkIn,
	entity,
}: SubCategoryCheckOptions) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const funcName = "checkForSubCategory";

		let subCategoryAttr: string;
		let subCategoryExists: boolean;
		let errMessage = "";
		try {
			switch (checkIn) {
				case "body":
					subCategoryAttr = req.body.subCategoryData[entity];

					subCategoryExists = await ifSubCategoryExistsByName(subCategoryAttr);

					if (subCategoryExists) {
						errMessage = `the request could not be completed because the sub-category-: ${subCategoryAttr} already exists.`;
						const err = new CustomError(errMessage);
						err.status = 400;

						throw err;
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
						errMessage = `the request could not be completed because the sub-category-: ${subCategoryAttr} does not exist.`;
						const err = new CustomError(errMessage);
						err.status = 400;

						throw err;
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

export default checkForSubCategory;
