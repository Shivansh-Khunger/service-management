// Import types
import type { Request, Response, NextFunction } from "express";
import type Joi from "joi";

import CustomError from "../utils/customError";

function handleValidationError(
	error: Joi.ValidationError,
	req: Request,
	next: NextFunction,
) {
	// Get the error message from the first validation error
	const errMessage = error.details[0].message;

	// Create a new Error with the error message
	const err = new CustomError(errMessage);
	// Set the HTTP status code for the error
	err.status = 422;

	// Create a log message for the error
	const errLogMessage = `-> req.body could not validate request at route-: ${req.route}`;
	// Set the log message for the error
	err.logMessage = errLogMessage;

	// Pass the error to the next middleware function
	next(err);
}

// Interface for params of validateBody function
interface validateBodyParams {
	schema: Joi.ObjectSchema;
	entity: string;
}

// Function to validate the request body
export const validateBody = ({ schema, entity }: validateBodyParams) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// Initialize a variable to hold any schema validation errors

		// biome-ignore lint/suspicious/noExplicitAny: <error in express are of type 'any'>
		let error: any;

		if (entity) {
			({ error } = schema.validate(req.body[entity]));
		} else {
			({ error } = schema.validate(req.body));
		}

		// If there are any schema validation errors
		if (error) {
			handleValidationError(error, req, next);
		}

		// If there are no schema validation errors, proceed to the next middleware function
		next();
	};
};

// Interface for params of validateParams function
interface validateParamsInput {
	schema: Joi.ObjectSchema;
}

// Function to validate the request parameters
export const validateParams = ({ schema }: validateParamsInput) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// Validate the request parameters against the provided schema
		const { error } = schema.validate(req.params);

		// If there are any schema validation errors
		if (error) {
			handleValidationError(error, req, next);
		}

		// If there are no schema validation errors, proceed to the next middleware function
		next();
	};
};
