/**
 * CustomError class that extends the built-in Error class in JavaScript.
 * It adds three optional properties: status, logMessage, and funcName.
 */
class CustomError extends Error {
    /**
     * HTTP status code for the error.
     */
    status?: number;

    /**
     * Message to be logged in the server logs.
     */
    logMessage?: string;

    /**
     * Name of the function where the error occurred.
     */
    funcName?: string;
}

// Export the CustomError class as the default export of this module.
export default CustomError;