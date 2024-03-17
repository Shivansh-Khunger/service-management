// Import types
import type { NextFunction } from "express";
import type mongoose from "mongoose";

// Import necessary modules
import CustomError from "../../utils/customError";

type valDocOptions = {
	nextFuncion: NextFunction;
	docExists: { _id: mongoose.Types.ObjectId } | null | undefined;
	passIfExists: boolean;
	collection: string;
	collectionAttr: string;
};

const validateDocumentExistence = ({
	nextFuncion,
	docExists,
	passIfExists,
	collection,
	collectionAttr,
}: valDocOptions) => {
	let errMessage: string;
	if (docExists && passIfExists) {
		nextFuncion();
	} else if (docExists) {
		errMessage = `the request could not be completed because the ${collection}-: ${collectionAttr} already exists.`;
		const err = new CustomError(errMessage);

		throw err;
	} else if (passIfExists) {
		errMessage = `the request could not be completed because the ${collection}-: ${collectionAttr} does not exist.`;
		const err = new CustomError(errMessage);

		throw err;
	} else {
		nextFuncion();
	}
};

export default validateDocumentExistence;
