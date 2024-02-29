// Import the helper function to get user's IMEI
import { getUserImei } from "../helpers/userExists";

// Import the ResponsePayload utility
import ResponsePayload from "../utils/resGenerator";

// Middleware function to check for IMEI
async function checkForImei(req, res, next) {
    // Define the function name for error handling
    const funcName = `checkForImei`;

    // Check if the device is not mobile
    // If it's not, proceed to the next middleware function
    if (!req.checkForImei) {
        next();
    }

    // Initialize a new ResponsePayload instance
    const resPayload = new ResponsePayload();

    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Extract the user data from the request body
    const { userData } = req.body;

    try {
        // Try to get the user's IMEI
        const user = await getUserImei(userId);

        // Initialize response messages
        let resMessage = ``;
        let resLogMessage = `-> response payload from ${funcName} controller`;

        // If the user exists
        if (user) {
            // If the user's IMEI does not match the IMEI in the request
            if (user.imeiNumber != userData.imeiNumber) {
                // Set the response message
                resPayload.message = "user already logged in from other device";

                // Log the response payload
                res.log.info(resPayload, resLogMessage);

                // Return a conflict status with the response payload
                return res.status(409).json(resPayload);
            }
        } else {
            // If the user does not exist, set the response message
            resMessage = `the request was not completed because no user is present with id-: ${userId}`;
            resPayload.setConflict(resMessage);

            // Log the response payload
            res.log.info(resPayload, resLogMessage);

            // Return a not found status with the response payload
            return res.status(404).json(resPayload);
        }

        // If there were no issues, proceed to the next middleware function
        next();
    } catch (err) {
        // If an error occurred, add the function name to the error
        err.funcName = funcName;

        // Pass the error to the next middleware function
        next(err);
    }
}

// Export the middleware function
export default checkForImei;