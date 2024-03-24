// Import types
import type { RequestHandler } from "express";

// Import necessary modules
import CustomError from "@utils/customError";

// Middleware function to check for API key in the request
const checkForApiKey: RequestHandler = (req, res, next) => {
    // Name of the current function
    const funcName = "checkForApiKey";

    // Extracting the API key from the request query parameters
    const apiKey = req.query.key;

    // If the API key in the request matches the one in the environment variables, proceed to the next middleware
    if (process.env.API_KEY?.toString().trim() === apiKey?.toString().trim()) {
        next();
    } else {
        // Error message to be sent in the response
        const errMessage = "invalid api key.";

        // Log message to be logged in the server logs
        const errLogMessage = `an invalid api key tried to access the private endpoint -: ${req.path}`;

        // Create a new custom error
        const err = new CustomError(errMessage);
        // Set the HTTP status code for the error
        err.status = 404;
        // Set the log message for the error
        err.logMessage = errLogMessage;
        // Set the function name for the error
        err.funcName = funcName;

        // Pass the error to the next middleware
        next(err);
    }
};

// Export the middleware function
export default checkForApiKey;
