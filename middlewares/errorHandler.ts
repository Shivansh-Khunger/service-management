// Import types
import type { ErrorRequestHandler } from "express";

// Import the ResponsePayload utility
import ResponsePayload from "../utils/resGenerator";

// Define a middleware function to handle errors
const handleError: ErrorRequestHandler = (err, req, res, next) => {
	// Create a new ResponsePayload instance
	const resPayload = new ResponsePayload();

	// Get the status from the error, or default to 500 if it's not set
	const status = err.status || 500;
	// Get the message from the error, or default to "server error" if it's not set
	const message = err.message || "server error";

	// Get the log message from the error, or generate a default one if it's not set
	const logMessage =
		err.logMessage || `-> error has occured in the ${err.funcName} function`;

	err.logMessage = undefined;

	// Set the error message in the response payload
	resPayload.setError(message);

	// Log the error with the log message
	res.log.error(err, logMessage);

	// Send the response with the status and the response payload
	return res.status(status).json(resPayload);
};

// Export the middleware function
export default handleError;
