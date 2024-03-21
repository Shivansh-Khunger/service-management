// Import types
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
import type { T_idCategory } from "../models/category";

// Import necessary modules
import ifCategoryExists from "../helpers/models/categoryExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import CustomError from "../utils/customError";
import augmentAndForwardError from "../utils/errorAugmenter";

export type CategoryCheckOptions =
	| {
			checkIn: "body";
			bodyEntity: string;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idCategory;
	  }
	| {
			checkIn: "query" | "params";
			bodyEntity: undefined | null;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idCategory;
	  };

export const checkForCategory = ({
	checkIn,
	bodyEntity,
	entity,
	passIfExists,
	key = "name",
}: CategoryCheckOptions) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const collectionName = "Category";
		const funcName = "checkForCategory";

		let valToKey: string;
		let categoryExists: { _id: mongoose.Types.ObjectId } | null | undefined;

		let errMessage: string;
		try {
			switch (checkIn) {
				case "body":
					valToKey = req.body[bodyEntity][entity];

					categoryExists = await ifCategoryExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFunction: next,
						docExists: categoryExists,
						passIfExists: passIfExists,
						collection: collectionName,
						collectionAttr: valToKey,
					});

					break;

				case "query":
					// added for future use
					break;

				case "params":
					valToKey = req.params[entity];

					categoryExists = await ifCategoryExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFunction: next,
						docExists: categoryExists,
						passIfExists: passIfExists,
						collection: collectionName,
						collectionAttr: valToKey,
					});

					break;
			}
		} catch (err) {
			// Handle the caught error by passing it to the augmentAndForwardError function which will pass it to the error handling middleware
			augmentAndForwardError({
				next: next,
				err: err,
				funcName: funcName,
				errStatus: 400,
			});
		}
	};
};

export default checkForCategory;
