// Import types
import type { CustomJwtPayload, JWT } from '@helpers/createTokens';
import type { RequestHandler } from 'express';

// Import necessary modules
import { insertJWT } from '@helpers/createCookie';
import createToken from '@helpers/createTokens';
import isRefreshTokenValid from '@helpers/validRefreshToken';
import { logger } from '@logger';
import CustomError from '@utils/customError';
import augmentAndForwardError from '@utils/errorAugmenter';
import jwt from 'jsonwebtoken';

// Define the middleware function
const checkForAccessToken: RequestHandler = (req, res, next) => {
    // Define the function name for logging purposes
    const funcName = 'checkForAccessToken';

    // Extract the access and refresh tokens from the request
    const { accessToken } = req.signedCookies;
    const { refreshToken } = req.signedCookies;

    // Initialize userCredentials object if it doesn't exist
    if (!req.userCredentials) {
        req.userCredentials = {
            userId: '',
        };
    }

    // Try to verify the access token
    try {
        if (accessToken) {
            // Verify the access token
            let decoded = jwt.verify(
                accessToken,
                process.env.JWT_ACCESS_SECRET_KEY,
            );

            decoded = decoded as CustomJwtPayload;

            // Assign the user ID from the decoded token to the request object
            req.userCredentials.userId = decoded.sub;
            req.userCredentials.userName = decoded.userData.name;
            req.userCredentials.userEmail = decoded.userData.email;

            // Log the successful verification
            logger.info(
                '-> the accessToken sent has been successfully verified.',
            );

            // Proceed to the next middleware
            next();
        } else {
            if (refreshToken) {
                try {
                    // Validate the refresh token
                    let refreshDecoded = isRefreshTokenValid(refreshToken);
                    refreshDecoded = refreshDecoded as CustomJwtPayload;

                    // Assign the user ID from the decoded refresh token to the request object
                    req.userCredentials.userId = refreshDecoded?.sub as string;

                    // Create the payload for the access token
                    const userAccessTokenPayload: JWT = {
                        sub: refreshDecoded.sub as string, // The subject of the token is the user's ID
                        userData: {
                            name: refreshDecoded.userData.name,
                            email: refreshDecoded.userData.email,
                        },
                    };

                    // Create the access token
                    const userAccessToken = createToken(
                        userAccessTokenPayload,
                        false, // This is not a refresh token
                    );

                    // Define the max age for the access token cookie
                    const userAccessCookieMaxAge = 1000 * 60 * 60; // One hour

                    // Insert the access token into a cookie
                    insertJWT({
                        res: res, // The response object
                        field: 'accessToken', // The name of the cookie
                        fieldValue: userAccessToken, // The value of the cookie
                        maxAge: userAccessCookieMaxAge, // The max age of the cookie
                    });

                    // Proceed to the next middleware
                    next();
                } catch (err) {
                    // If an error occurs, augment and forward the error
                    augmentAndForwardError({
                        next: next,
                        err: err,
                        funcName: funcName,
                    });
                }
            } else {
                // If there's no access token, throw an error
                const err = new CustomError(
                    'Request could not be authenticated.',
                );
                err.status = 401;

                throw err;
            }
        }
    } catch (err) {
        // If an error occurs, create a new custom error
        const error = new CustomError();

        // If the error is due to an expired token
        if ((err as jwt.VerifyErrors).name === 'TokenExpiredError') {
            // Set the error message, status, and log message
            error.message =
                'Request could not be authenticated due to expired access token.';
            error.status = 401;
            error.logMessage = 'an expired access token has been received.';
        }

        // If the error is due to an invalid token
        if ((err as jwt.VerifyErrors).name === 'JsonWebTokenError') {
            // Set the error message, status, and log message
            error.message =
                'Request could not be authenticated due to invalid access token.';
            error.status = 401;
            error.logMessage = 'an invalid access token has been received.';
        }

        // Augment and forward the error
        augmentAndForwardError({
            next: next,
            err: error,
            funcName: funcName,
        });
    }
};

// Export the middleware function
export default checkForAccessToken;
