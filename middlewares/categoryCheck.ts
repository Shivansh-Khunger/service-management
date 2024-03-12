// Import types
import type { NextFunction, Request, Response } from "express";

// Import necessary modules
import {
	ifCategoryExistsById,
	ifCategoryExistsByName,
} from "../helpers/categoryExists";

import handleCatchError from "../utils/catchErrorHandler";
import CustomError from "../utils/customError";

interface CategoryCheckOptions {
	checkIn: "body" | "query" | "params";
	entity: string;
}

export const checkForCategory = ({ checkIn, entity }: CategoryCheckOptions) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const funcName = "checkForCategory";

		let categoryAttr: string;
		let categoryExists: boolean;

		let errMessage = "";
		try {
			switch (checkIn) {
				case "body":
					categoryAttr = req.body.categoryData[entity];

					categoryExists = await ifCategoryExistsByName(categoryAttr);

					if (categoryExists) {
						errMessage = `the request could not be completed because the category-: ${categoryAttr} already exists.`;

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
					categoryAttr = req.params[entity];

					categoryExists = await ifCategoryExistsById(categoryAttr);

					if (!categoryExists) {
						errMessage = `the request could not be completed because the category-: ${categoryAttr} does not exist.`;

						const err = new CustomError(errMessage);
						err.status = 400;

						throw err;
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

export default checkForCategory;
