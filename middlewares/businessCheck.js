// Import the business model
import business from "../models/business.js";

// Middleware function to check if a business exists
async function checkForBusiness(req, res, next) {
    // Define the function name for error handling
    const funcName = `checkForBusiness`;

    try {
        // Try to find the business with the given ID
        const ifBusiness = await business.findOne(req.params.businessId);

        // Extract the business ID from the request parameters
        const { businessId } = req.params;

        // If the business exists, proceed to the next middleware function
        if (ifBusiness) {
            next();
        } else {
            // If the business does not exist, create an error message
            const errMessage = `business-: ${businessId} does not exist.`;

            // Create a new error with the error message
            const err = new Error(errMessage);
            // Set the HTTP status code for the error
            err.status = 404;
            // Set the function name for the error
            err.funcName = funcName;

            // Pass the error to the next middleware function
            next(err);
        }
    } catch (err) {
        // If an error occurred while trying to find the business, add the function name to the error
        err.funcName = funcName;

        // Pass the error to the next middleware function
        next(err);
    }
}

// Export the middleware function
export default checkForBusiness;
