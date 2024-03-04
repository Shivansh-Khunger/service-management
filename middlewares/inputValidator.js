import Joi from "joi";

// Function to validate the request body
export function validateBody({ schema = Joi.object({}), entity = null }) {
	return function (req, res, next) {
		// Initialize a variable to hold any schema validation errors
		let error;
		let val;

		// If an entity is provided, validate the entity in the request body
		// Otherwise, validate the entire request body
		if (!req.body[entity]) {
			// Get the error message from the first validation error
			const errMessage = `the request could not be completed due to absesence of ${entity} in the body of request.`;

			// Create a new Error with the error message
			const err = new Error(errMessage);
			// Set the HTTP status code for the error
			err.status = 422;

			// Create a log message for the error
			const errLogMessage = `-> req.body could not validate request at route-: ${req.route}`;
			// Set the log message for the error
			err.logMessage = errLogMessage;

			// Pass the error to the next middleware function
			next(err);
		}

		if (entity) {
			// console.log(req.body[entity]);
			({ error, val } = schema.validate(req.body[entity]));
		} else {
			({ error, val } = schema.validate(req.body));
		}

		// If there are any schema validation errors
		if (error) {
			// Get the error message from the first validation error
			const errMessage = error.details[0].message;

			// Create a new Error with the error message
			const err = new Error(errMessage);
			// Set the HTTP status code for the error
			err.status = 422;

			// Create a log message for the error
			const errLogMessage = `-> req.body could not validate request at route-: ${req.route}`;
			// Set the log message for the error
			err.logMessage = errLogMessage;

			// Pass the error to the next middleware function
			next(err);
		}

		// If there are no schema validation errors, proceed to the next middleware function
		next();
	};
}

// Function to validate the request parameters
export function validateParams({ schema = Joi.object({}) }) {
	return function (req, res, next) {
		// Validate the request parameters against the provided schema
		const { error, val } = schema.validate(req.params);

		// If there are any schema validation errors
		if (error) {
			// Get the error message from the first validation error
			const errMessage = error.details[0].message;

			// Create a new Error with the error message
			const err = new Error(errMessage);
			// Set the HTTP status code for the error
			err.status = 422;

			// Create a log message for the error
			const errLogMessage = `-> req.params could not validate request at route-: ${req.route.path}`;
			// Set the log message for the error
			err.logMessage = errLogMessage;

			// Pass the error to the next middleware function
			next(err);
		}

		// If there are no schema validation errors, proceed to the next middleware function
		next();
	};
}
