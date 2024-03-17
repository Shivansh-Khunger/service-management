// Import types
import type { NextFunction, Request, Response } from "express";
import type mongoose from "mongoose";
import type { T_idProduct } from "../models/product";

// Import necessary modules
import ifProductExists from "../helpers/models/productExists";
import validateDocumentExistence from "./helpers/valDocExistence";

import CustomError from "../utils/customError";
import augmentAndForwardError from "../utils/errorAugmenter";

type ProductCheckOptions =
	| {
			checkIn: "body";
			bodyEntity: string;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idProduct;
	  }
	| {
			checkIn: "query" | "params";
			bodyEntity: undefined | null;
			entity: string;
			passIfExists: boolean;
			key: keyof T_idProduct;
	  };

// Middleware function to check if a product exists
const checkForProduct = ({
	checkIn,
	bodyEntity,
	entity,
	passIfExists,
	key = "name",
}: ProductCheckOptions) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Define the function name for error handling
		const collectionName = "Product";
		const funcName = "checkForProduct";

		let valToKey: string;
		let productExists: { _id: mongoose.Types.ObjectId } | null | undefined;

		let errMessage: string;
		try {
			switch (checkIn) {
				case "body":
					valToKey = req.body[bodyEntity][entity];
					productExists = await ifProductExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFuncion: next,
						docExists: productExists,
						passIfExists: passIfExists,
						collection: collectionName,
						collectionAttr: valToKey,
					});
					break;
				case "query":
					// added for future use
					break;
				case "params":
					valToKey = req[checkIn][entity];
					productExists = await ifProductExists(next, {
						[key]: valToKey,
					});

					validateDocumentExistence({
						nextFuncion: next,
						docExists: productExists,
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
			augmentAndForwardError({
				next: next,
				err: err,
				funcName: funcName,
				errStatus: 400,
			});
		}
	};
};

export default checkForProduct;
