// Importing types
import type { CustomJwtPayload, JWT } from '@helpers/createTokens';
import type { RequestHandler } from 'express';

// Importing necessary modules
import { insertJWT } from '@helpers/createCookie';
import createToken from '@helpers/createTokens';
import isRefreshTokenValid from '@helpers/validRefreshToken';
import augmentAndForwardError from '@utils/errorAugmenter';
import ResponsePayload from '@utils/resGenerator';

// Define the function to assign a new refresh token
export const assignNewRefreshToken: RequestHandler = async (req, res, next) => {
    // Define the function name for logging purposes
    const funcName = 'assignNewRefreshToken';

    // Create a new response payload
    const resPayload = new ResponsePayload();

    // Extract the refresh token from the signed cookies in the request
    const { refreshToken } = req.signedCookies;

    try {
        // Validate the refresh token
        let decode = isRefreshTokenValid(refreshToken);
        decode = decode as CustomJwtPayload;

        // Create a payload for the new refresh token
        const userRefreshTokenPayload: JWT = {
            sub: decode.sub as string,
            userData: {
                name: decode.userData.name,
                email: decode.userData.email,
            },
        };

        // Create a new refresh token
        const userRefreshToken = createToken(userRefreshTokenPayload, true);

        // Define the max age for the refresh token cookie (1 week)
        const userRefreshCookieMaxAge = 1000 * 60 * 60 * 24 * 7;

        // Insert the new refresh token into a cookie
        insertJWT({
            res: res,
            field: 'refreshToken',
            fieldValue: userRefreshToken,
            maxAge: userRefreshCookieMaxAge,
        });

        // Define the success message for the response
        const resMessage =
            'Request to refresh the refresh token is successfull.';

        // Set the success message in the response payload
        resPayload.setSuccess(resMessage);

        // Define the log message for the response
        const resLogMessage = `-> response for ${funcName} controller`;

        // Log the success message
        res.log.info(resMessage, resLogMessage);

        // Return a successful response with the response payload
        return res.status(200).json(resPayload);
    } catch (err) {
        // If an error occurs, augment it and forward it to the next middleware
        augmentAndForwardError({ next: next, err: err, funcName: funcName });
    }
};
