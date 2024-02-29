// Import the ResponsePayload utility
import ResponsePayload from "../utils/resGenerator.js";

// Define a middleware function to handle errors
function handleError(err, req, res, next) {
    // Create a new ResponsePayload instance
    const resPayload = new ResponsePayload();

    // Get the status from the error, or default to 500 if it's not set
    const status = err.status || 500;
    // Get the message from the error, or default to "server error" if it's not set
    const message = err.message || `server error`;

    // Get the log message from the error, or generate a default one if it's not set
    const logMessage =
        err.logMessage || `-> error has occured in the ${err.funcName} function`;

    // Set the error message in the response payload
    resPayload.setError(message);

    // Log the error with the log message
    res.log.error(err, logMessage);
    // Send the response with the status and the response payload
    res.status(status).json(resPayload);

    // Proceed to the next middleware function
    next();
}

// Export the middleware function
export default handleError;