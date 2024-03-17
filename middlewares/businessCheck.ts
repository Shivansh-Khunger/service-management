// Import types
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
import type { T_idBusiness } from "../models/business";

// Import necessary modules
import ifBusinessExists from "../helpers/models/businessExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import CustomError from "../utils/customError";
import augmentAndForwardError from "../utils/errorAugmenter";

type BusinessCheckOptions =
	| {
			checkIn: "body";
			bodyEntity: string;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idBusiness;
	  }
	| {
			checkIn: "query" | "params";
			bodyEntity: undefined | null;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idBusiness;
	  };

// Middleware function to check if a business exists
const checkForBusiness = ({
	checkIn,
	bodyEntity,
	entity,
	passIfExists,
	key = "name",
}: BusinessCheckOptions) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Define the function name for error handling
		const collectionName = "Business";
		const funcName = "checkForBusiness";

		let valToKey: string;
		let businessExists: { _id: mongoose.Types.ObjectId } | null | undefined;

		let errMessage: string;
		try {
			switch (checkIn) {
				case "body":
					valToKey = req.body[bodyEntity][entity];
					businessExists = await ifBusinessExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFuncion: next,
						docExists: businessExists,
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
					businessExists = await ifBusinessExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFuncion: next,
						docExists: businessExists,
						passIfExists: passIfExists,
						collection: collectionName,
						collectionAttr: valToKey,
					});

					break;

				default: {
					errMessage = `the request could not be completed because the checkIn-: ${checkIn} is not supported.`;
					const err = new CustomError(errMessage);

					throw err;
				}
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

// Export the middleware function
export default checkForBusiness;
