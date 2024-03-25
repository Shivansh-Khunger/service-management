// Import necessary modules
import CustomError from "@utils/customError";
import jwt from "jsonwebtoken";

// Define the function to validate the refresh token
function isRefreshTokenValid(refreshToken: string) {
    try {
        // Try to verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY,
        );

        // If successful, return the decoded token
        return decoded;
    } catch (err) {
        // If an error occurs, create a new custom error
        const error = new CustomError();

        // If the error is due to an expired token
        if ((err as jwt.VerifyErrors).name === "TokenExpiredError") {
            // Set the error message, status, and log message
            error.message =
                "Request could not be authenticated due to expired refresh token.";
            error.status = 403;
            error.logMessage = "an expired access token has been received.";
        }

        // If the error is due to an invalid token
        if ((err as jwt.VerifyErrors).name === "JsonWebTokenError") {
            // Set the error message, status, and log message
            error.message =
                "Request could not be authenticated due to invalid refresh token.";
            error.status = 401;
            error.logMessage = "an invalid access token has been received.";
        }

        // Throw the custom error
        throw error;
    }
}

// Export the function
export default isRefreshTokenValid;
