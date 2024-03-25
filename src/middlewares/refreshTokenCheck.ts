// Import types
import type { RequestHandler } from "express";

// Import necessary modules
import isRefreshTokenValid from "@helpers/validRefreshToken";
import { logger } from "@logger";
import CustomError from "@utils/customError";
import augmentAndForwardError from "@utils/errorAugmenter";

// Define the middleware function
const checkForRefreshToken: RequestHandler = (req, res, next) => {
    // Define the function name for logging purposes
    const funcName = "checkForRefreshToken";

    // Extract the refresh token from the request
    const { refreshToken } = req.signedCookies;

    // Initialize userCredentials object if it doesn't exist
    if (!req.userCredentials) {
        req.userCredentials = {
            userId: "",
        };
    }

    // Try to verify the refresh token
    try {
        if (refreshToken) {
            // If the refresh token is valid
            if (isRefreshTokenValid(refreshToken)) {
                // Log the successful verification
                logger.info(
                    "-> the refreshToken sent has been successfully verified.",
                );

                // Proceed to the next middleware
                next();
            }
        } else {
            // If there's no refresh token, throw an error
            const err = new CustomError("Request could not be authenticated.");
            err.status = 401;

            throw err;
        }
    } catch (err) {
        // If an error occurs, augment and forward the error
        augmentAndForwardError({
            next: next,
            err: err,
            funcName: funcName,
        });
    }
};

// Export the middleware function
export default checkForRefreshToken;
